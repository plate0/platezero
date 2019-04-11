const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const _ = require('lodash');
const Fraction = require('fraction.js');

const dir = '/Users/ben/Desktop/recipes';
const filenames = fs.readdirSync(dir);
const recipes = filenames.map(name => path.join(dir, name)).map(handleFile);
console.log(JSON.stringify(recipes));

function handleFile(filename) {
  const content = fs.readFileSync(filename, {encoding: 'utf-8'});
  const front = fm(content);
  const json = front.attributes;
  const recipe = {
    title: json.title,
    description: front.body || undefined,
    source_url: _.get(json, 'adapted_from.url'),
    source_author: _.get(json, 'adapted_from.name'),
    source_title: _.get(json, 'adapted_from.name'),
    source_isbn: _.toString(_.get(json, 'adapted_from.isbn')) || undefined,
    yield: json.yield,
    preheats: getPreheats(json),
    ingredient_lists: getIngredientLists(json),
    procedure_lists: getProcedureLists(json),
  };
  return recipe;
}

function getPreheats(json) {
  const preheats = [];
  if (json.preheat) {
    preheats.push({name: 'Oven', temperature: json.preheat, unit: 'F'});
  }
  if (json.sousvide) {
    preheats.push({
      name: 'Sous Vide',
      temperature: json.sousvide,
      unit: 'F',
    });
  }
  return preheats;
}

function getIngredientLists(json) {
  if (_.isArray(_.get(_.head(json.ingredients), 'items'))) {
    return _.map(json.ingredients, section => ({
      name: section.section,
      lines: getIngredients(section.items),
    }));
  } else {
    return [
      {
        lines: getIngredients(json.ingredients),
      },
    ];
  }
}

function getIngredients(list) {
  return _.map(list, ing => {
    const line = {
      name: ing.item,
      preparation: ing.preparation,
      optional: !!ing.optional,
      unit: unitfy(ing.unit),
    };
    if (ing.qty) {
      try {
        const {n, d} = new Fraction(ing.qty);
        line.quantity_numerator = n;
        line.quantity_denominator = d;
      } catch (e) {}
    }
    return line;
  });
}

function getProcedureLists(json) {
  if (_.isArray(_.get(_.head(json.procedure), 'items'))) {
    return _.map(json.procedure, section => ({
      name: section.section,
      lines: getProcedure(section.items),
    }));
  } else {
    return [
      {
        lines: getProcedure(json.procedure),
      },
    ];
  }
}

function getProcedure(json) {
  return _.map(json, text => ({text: _.toString(text)}));
}

function unitfy(s) {
  if (!s) {
    return undefined;
  }
  if (s === 'T') {
    return 'tbsp';
  }
  const unit = s.toLowerCase();
  switch (unit) {
    case 'oz':
    case 'g':
    case 'mg':
    case 'kg':
    case 'lb':
    case 'c':
    case 'tbsp':
    case 'tsp':
    case 'l':
    case 'dl':
    case 'ml':
    case 'in':
    case 'ft':
    case 'cm':
    case 'm':
      return unit;
    case 'pound':
    case 'pounds':
    case 'lbs':
      return 'lb';
    case 'tablespoon':
    case 'tablespoons':
    case 'tbsps':
    case 'tbsp.':
      return 'tbsp';
    case 'teaspoon':
    case 'teaspoons':
    case 'tsps':
    case 'tsps.':
    case 'tsp.':
    case 't':
      return 'tsp';
    case 'cups':
    case 'cup':
    case 'cups.':
    case 'cup.':
      return 'c';
  }
}
