import { parseProcedureLists } from './ProcedureListsEditor'

describe('parseProcedureLists', () => {
  it('should work', () => {
    expect(parseProcedureLists('step 1\nstep 2')).toEqual([
      {
        name: undefined,
        lines: [
          { text: 'step 1', image_url: undefined, title: undefined },
          { text: 'step 2', image_url: undefined, title: undefined }
        ]
      }
    ])
  })

  it('should handle a header before a section', () => {
    expect(parseProcedureLists('#section\nstep 1')).toEqual([
      {
        name: 'section',
        lines: [{ text: 'step 1', image_url: undefined, title: undefined }]
      }
    ])
  })

  it('should skip blank lines', () => {
    expect(parseProcedureLists('step1\n\n\n\n\n\nstep2')).toEqual([
      {
        name: undefined,
        lines: [
          { text: 'step1', image_url: undefined, title: undefined },
          { text: 'step2', image_url: undefined, title: undefined }
        ]
      }
    ])
  })

  it('should start a new section when a header is encountered', () => {
    expect(
      parseProcedureLists(`
s1s1
#new section
s2s1`)
    ).toEqual([
      {
        name: undefined,
        lines: [{ text: 's1s1', image_url: undefined, title: undefined }]
      },
      {
        name: 'new section',
        lines: [{ text: 's2s1', image_url: undefined, title: undefined }]
      }
    ])
  })

  it('should handle images', () => {
    expect(
      parseProcedureLists(`
image:http://example.com/img.jpg
step1
image:     http://example.com/i2.jpg       
image:http://example.com/i3.jpg`)
    ).toEqual([
      {
        name: undefined,
        lines: [
          {
            text: 'step1',
            image_url: 'http://example.com/img.jpg',
            title: undefined
          },
          {
            text: undefined,
            image_url: 'http://example.com/i2.jpg',
            title: undefined
          },
          {
            text: undefined,
            image_url: 'http://example.com/i3.jpg',
            title: undefined
          }
        ]
      }
    ])
  })

  it('should handle line breaks', () => {
    expect(
      parseProcedureLists(`
# section 1
here is a step  
that spans two lines
with a second step
# section 2
`)
    ).toEqual([
      {
        name: 'section 1',
        lines: [
          {
            text: 'here is a step  \nthat spans two lines',
            image_url: undefined,
            title: undefined
          },
          {
            text: 'with a second step',
            image_url: undefined,
            title: undefined
          }
        ]
      },
      {
        name: 'section 2',
        lines: []
      }
    ])
  })

  it('should handle tables', () => {
    expect(
      parseProcedureLists(`
# section 1
here is a step  
|with|a|table|
|---|
|in|it|
# section 2
`)
    ).toEqual([
      {
        name: 'section 1',
        lines: [
          {
            text: 'here is a step  \n|with|a|table|\n|---|\n|in|it|',
            image_url: undefined,
            title: undefined
          }
        ]
      },
      {
        name: 'section 2',
        lines: []
      }
    ])
  })
})
