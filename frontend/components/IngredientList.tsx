// import React from 'react'
// import { Button, Row, Col, FormGroup, Input, Label } from 'reactstrap'
// import * as _ from 'lodash'

// import { IngredientLine } from './IngredientLine'
// import { ActionLine } from './ActionLine'
// import { IngredientLineJSON } from '../models/ingredient_line'
import { IngredientListJSON } from '../models/ingredient_list'
// import {
//   UITrackable,
//   uiToJSON,
//   generateUITrackable,
//   removeItem,
//   restoreItem,
//   replaceItem
// } from '../common/changes'

// const newIngredient = generateUITrackable({
//   id: undefined,
//   quantity_numerator: undefined,
//   quantity_denominator: undefined,
//   name: '',
//   preparation: '',
//   optional: false,
//   unit: ''
// })

interface Props {
  onChange?: (ingredientList: IngredientListJSON) => void
  ingredientList?: IngredientListJSON
}

// interface State {
//   name: string
//   lines: UITrackable<IngredientLineJSON>[]
// }

// const fallbackToNewIngredientList = (ingredientList?: IngredientListJSON) => {
//   if (ingredientList) {
//     return {
//       ...ingredientList,
//       lines: _.map(ingredientList.lines, line => ({
//         json: line,
//         added: false,
//         changed: false,
//         removed: false,
//         original: line
//       }))
//     }
//   }
//   return {
//     name: '',
//     lines: [newIngredient.next().value]
//   }
// }

export function IngredientList(props: Props) {
  return <pre>IngredientList {JSON.stringify(props)}</pre>
}

// export class IngredientList extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props)
//     this.addIngredient = this.addIngredient.bind(this)
//     this.notifyChange = this.notifyChange.bind(this)
//     this.getIngredientList = this.getIngredientList.bind(this)
//     this.replaceLine = this.replaceLine.bind(this)
//     this.removeLine = this.removeLine.bind(this)
//     this.restoreLine = this.restoreLine.bind(this)
//     const list = fallbackToNewIngredientList(props.ingredientList)
//     const { name, lines } = list
//     this.state = { name, lines }
//   }

//   public getIngredientList(): IngredientListJSON {
//     return {
//       name: this.state.name,
//       lines: _.map(this.state.lines, uiToJSON)
//     }
//   }

//   public notifyChange() {
//     if (_.isFunction(this.props.onChange)) {
//       this.props.onChange(this.getIngredientList())
//     }
//   }

//   public addIngredient() {
//     const line = newIngredient.next().value
//     this.setState(
//       state => ({ lines: [...state.lines, line] }),
//       this.notifyChange
//     )
//   }

//   public replaceLine(ingredient: IngredientLineJSON): void {
//     this.setState(
//       state => ({
//         lines: replaceItem(state.lines, ingredient)
//       }),
//       this.notifyChange
//     )
//   }

//   public removeLine(line: UITrackable<IngredientLineJSON>): void {
//     this.setState(
//       state => ({
//         lines: removeItem(state.lines, line)
//       }),
//       this.notifyChange
//     )
//   }

//   public restoreLine(line: UITrackable<IngredientLineJSON>): void {
//     this.setState(
//       state => ({
//         lines: restoreItem(state.lines, line)
//       }),
//       this.notifyChange
//     )
//   }

//   public render() {
//     return (
//       <>
//         <ActionLine icon="fal fa-times invisible" onAction={_.noop}>
//           <Row className="font-weight-bold" noGutters={true}>
//             <Col xs="auto" md="2" className="pl-3">
//               Amount
//             </Col>
//             <Col xs="auto" md="2" className="pl-3">
//               Unit
//             </Col>
//             <Col xs="auto" md={true} className="pl-3">
//               Ingredient
//             </Col>
//             <Col xs="auto" md="3" className="pl-3">
//               Preparation
//             </Col>
//             <Col xs="auto" className="invisible">
//               <FormGroup check>
//                 <Label check>
//                   <Input type="checkbox" />
//                   <small>Optional</small>
//                 </Label>
//               </FormGroup>
//             </Col>
//           </Row>
//         </ActionLine>
//         {this.state.lines.map(ingredient => (
//           <IngredientLine
//             key={ingredient.json.id}
//             ingredient={ingredient.json}
//             onChange={newIngredient => this.replaceLine(newIngredient)}
//             removed={ingredient.removed}
//             added={ingredient.added}
//             changed={ingredient.changed}
//             onRemove={() => this.removeLine(ingredient)}
//             onRestore={() => this.restoreLine(ingredient)}
//           />
//         ))}
//         <p>
//           <Button color="secondary" size="sm" onClick={this.addIngredient}>
//             Add Ingredient
//           </Button>
//         </p>
//       </>
//     )
//   }
// }
