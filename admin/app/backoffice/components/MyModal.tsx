import { ReactNode } from "react";

interface ModalProps {
  id: string;
  title: string;
  modalSize?: string;
  modalColor?: string; // Optional modal color
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ id, title, modalSize, modalColor, children }) => {
  return (
    <div className="modal fade" id={id} tabIndex={-1}>
      <div className={`modal-dialog ${modalSize}`}>
        <div className={`modal-content ${modalColor}`}>
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close btn "
              data-bs-dismiss="modal"
              aria-label="Close"
              id={id + '_btnClose'}
              style={{
                backgroundColor: 'red', // Set the close button background color to red
                border: 'none', // Remove border
                opacity: 1, // Ensure full opacity
              }}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
