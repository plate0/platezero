import {parseAmount} from './amount'

describe('parseAmount', () => {
    it('should detect a whole number', () => {
      expect(parseAmount('42 tons sand')).toEqual([42, 1, 'tons sand'])
    })

    it('should detect a whole number followed by a number that is not a fraction but part of the text', () => {
      expect(parseAmount('1 400g can worms')).toEqual([1, 1, '400g can worms'])
    })

    it('should detect a whole number followed by a fraction', () => {
      expect(parseAmount('1 1/2 eggs')).toEqual([3, 2, 'eggs'])
    })

    it('should detect a fraction', () => {
      expect(parseAmount('1/2 lb tuppeny rice')).toEqual([1, 2, 'lb tuppeny rice'])
    })

    it('should detect a decimal with a leading zero', () => {
      expect(parseAmount('0.5 lb tuppeny rice')).toEqual([1, 2, 'lb tuppeny rice'])
    })

    it('should detect a decimal with a leading non-zero value', () => {
      expect(parseAmount('1.5 lb tuppeny rice')).toEqual([3, 2, 'lb tuppeny rice'])
    })

    it('should detect a decimal with no leading zero', () => {
      expect(parseAmount('.5 lb tuppeny rice')).toEqual([1, 2, 'lb tuppeny rice'])
    })

    it('should not fail if no amount is detected', () => {
      expect(parseAmount('a whole bunch of other stuff')).toEqual([undefined, undefined, 'a whole bunch of other stuff'])
    })

})