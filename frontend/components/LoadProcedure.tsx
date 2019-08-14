import { Alert, Button, Row, Col } from 'reactstrap'
import { ProcedureListsEditor, Back } from '.'

export const LoadProcedure = ({
  src,
  onChange,
  onSubmit,
  Sample,
  Instructions,
  back
}) => {
  return (
    <Row>
      <Col xs="12">
        <Alert color="danger">
          Sorry, the importer could not find the instructions.
        </Alert>
        <Sample src={src} />
      </Col>
      <Col xs="12">
        <p>
          <Instructions src={src} />
          Paste them into the text field below and edit them however you would
          like. When done, press 'Save & Continue'.
        </p>
        <ProcedureListsEditor lists={[]} onChange={onChange} />
      </Col>
      <Col xs="12" className="d-flex justify-content-between">
        <Back route={back} />
        <Button color="primary" onClick={onSubmit}>
          Save & Continue
        </Button>
      </Col>
    </Row>
  )
}
