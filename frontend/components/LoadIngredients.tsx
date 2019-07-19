import { Alert, Button, Row, Col } from 'reactstrap'
import { IngredientListsEditor } from '.'

export const LoadIngredients = ({
  disabled,
  src,
  onChange,
  onSubmit,
  Sample,
  Instructions,
  Back
}) => {
  return (
    <Row>
      <Col xs="12">
        <Alert color="danger">
          Sorry, the importer could not find the ingredients.
        </Alert>
        <Sample src={src} />
      </Col>
      <Col xs="12">
        <h2>Oops, that didn&rsquo;t quite work.</h2>
        <p>
          <Instructions src={src} />
          Paste them into the text field below and edit them however you would
          like. When done, press <em>Save & Continue</em>.
        </p>
        <IngredientListsEditor lists={[]} onChange={onChange} />
      </Col>
      <Col xs="12" className="d-flex justify-content-between my-3">
        <Back />
        <Button color="primary" onClick={onSubmit} disabled={disabled}>
          Save & Continue
        </Button>
      </Col>
    </Row>
  )
}
