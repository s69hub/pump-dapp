import React, { useState } from "react";
import { Container, Row, Col, Modal, CloseButton } from "react-bootstrap";

function SuccessModal(props) {
  const [showModal, setShowModal] = useState(props.show);

  return (
    <>
      <Modal
        size={props.size}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showModal}
      >
        <Modal.Body>
          <div className="text-right">
            <CloseButton variant="dark" onClick={() => setShowModal(false)} />
          </div>
          <Container className="text-center">
            <Row>
              <Col lg={12}>{props.msg}</Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SuccessModal;
