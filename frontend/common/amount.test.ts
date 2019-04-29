import {parseAmount} from './amount'

describe('parseAmount', () => {
    it('should detect whole number', () => {
      expect(parseAmount('42 tons sand')).toEqual([42, 1, 'tons sand'])
    })

})