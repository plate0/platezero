import {parseAmount} from './IngredientListsEditor'

describe('parseAmount', () => {
    it('should detect whole number', () => {
      expect(parseAmount('42 tons sand')).toBe(42, 1, 'tons sand')
    })

})