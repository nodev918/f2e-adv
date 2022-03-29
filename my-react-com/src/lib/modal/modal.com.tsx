import React, { ReactElement, ReactNode } from 'react'
import ReactDOM from 'react-dom'

import './style.scss'
import scopedclassname from '../helpers/scopedclassname'
import Icon from '../icon/icon.com'


interface Props {
    visible: boolean
    closeBtn?: boolean
    closeOnClickMask?: boolean
    header?: string
    footer?: Array<ReactElement>
    onClose: React.MouseEventHandler
}

const sc = scopedclassname('mol-modal')

const Modal: React.FunctionComponent<Props> = (props) => {

    const onClickClose: React.MouseEventHandler = (e) => {
        props.onClose(e)
    }
    const onClickMask: React.MouseEventHandler = (e) => {
        if (props.closeOnClickMask) {
            props.onClose(e)
        }
    }
    const renderModal = (
        props.visible &&
        <>
            <div className={sc('mask')} onClick={onClickMask}></div>
            <div className={sc()}>
                {props.closeBtn && <div className={sc('close')} onClick={onClickClose}><Icon shape="guanbi"></Icon></div>}
                {props.header && <header> {props.header} </header>}
                <main>{props.children}</main>
                {props.footer && props.footer.length > 0 &&
                    <footer>
                        {props.footer.map((button, index) =>
                            React.cloneElement(button, { key: index })
                        )}
                    </footer>
                }
            </div>
        </>
    )

    return (
        ReactDOM.createPortal(renderModal, document.body)
    )
}

const dialog = (content: ReactNode, footer?: Array<ReactElement>, afterClose?: () => void) => {
    const close = () => {
        ReactDOM.render(React.cloneElement(component, { visible: false }), div)
        ReactDOM.unmountComponentAtNode(div)
        div.remove()
    }
    const component =(
        <Modal
            visible={true}
            footer={footer}
            onClose={() => {
                close();
                afterClose && afterClose()
            }}>
            {content}
        </Modal>)
    const div = document.createElement('div')
    document.body.append(div)
    ReactDOM.render(component, div)
    return close
}

// const dialog = (content: ReactNode) => {
//     const com = <Modal visible={true} onClose={() => {
//         ReactDOM.render(React.cloneElement(com, { visible: false }), div)
//         ReactDOM.unmountComponentAtNode(div)
//         div.remove()
//     }}> {content} </Modal>
//     const div = document.createElement('div')
//     document.body.append(div)
//     ReactDOM.render(com, div)
// }

const alert = (content: string) => {
    const footer = <button onClick={() => close()}>OK</button>
    const close = dialog(content, [footer])
}
const confirm = (content: string, yes?: () => void, no?: () => void) => {
    const onYes = () => {
        close()
        yes && yes()
    }
    const onNo = () => {
        close()
        no && no()
    }
    const footer = [
        <button onClick={onYes}>yes</button>,
        <button onClick={onNo}>no</button>
    ]
    const close = dialog(content, footer, no)
}

Modal.defaultProps = {
    closeBtn: true,
    closeOnClickMask: true
}

export { dialog, alert, confirm }
export default Modal