import React, { Component } from 'react';
import { ReactComponent as InfoTooltipSvg } from '../../../img/info-tooltip.svg';
import { ReactComponent as EmailPopupSvg } from '../../../img/email-popup.svg';
import GoBackSvg from '../../svg/GoBackSvg';
import { handleIOSBrowser } from '../../../util/browser-util';
import { animateIn, getSectionClassName } from '../../../util/animation-util';
export interface HelperEmailState {
  email: string;
  fullname: string;
}
interface HelperEmailProps {
  email: string;
  fullname: string;
  goBack: () => void;
  goForward: (prevCardState: HelperEmailState) => void;
  errorMessage: string;
  position?: string;
}
export default class HelperEmail extends Component<
  HelperEmailProps,
  HelperEmailState
> {
  constructor(props: Readonly<HelperEmailProps>) {
    super(props);
    const { email, fullname } = { ...props };
    this.state = { email, fullname };
  }
  componentDidMount() {
    handleIOSBrowser();
    animateIn(this.refs.section);
  }
  render() {
    const { email, fullname } = { ...this.state };
    const { goBack, goForward, errorMessage } = { ...this.props };
    return (
      <div
        ref="section"
        id="section-0-helper"
        className={getSectionClassName(this.props.position)}
      >
        <div className="section-contents">
          <div className="title1">Document Helper</div>
          <div className="subtitle">Ok, let's pick a username</div>
          <div className="card owner1">
            <div className="card-body">
              <div className="card-body-section" style={{ marginTop: 0 }}>
                <div className="helper-login">How can owners find you?</div>
                <div className="helper-excerpt">
                  Your name and e-mail are used by document owners to find and
                  add you to their network
                </div>
              </div>
              <div className="card-body-section1">
                {errorMessage && <div className="error">{errorMessage}</div>}
                <div className="form-control1">
                  <label>Full Name</label>
                  <input
                    className="username-input"
                    name="fullname"
                    type="text"
                    value={fullname}
                    onChange={(e) =>
                      this.setState({ fullname: e.target.value })
                    }
                  />
                </div>
                <div className="form-control1" style={{ marginTop: '10px' }}>
                  <div className="info-section">
                    <label>E-mail</label>
                    <div className="tooltip1">
                      <EmailPopupSvg />
                      <InfoTooltipSvg />
                    </div>
                  </div>
                  <input
                    name="email"
                    type="text"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
              </div>
              <div className="bottom">
                <input
                  style={{ width: '210px', marginTop: '27px' }}
                  type="button"
                  value="Next"
                  disabled={email.length < 1 || fullname.length < 1}
                  onClick={() => goForward(this.state)}
                />
              </div>
            </div>
          </div>
          <GoBackSvg color="#4BA9D9" goBack={goBack} />
        </div>
      </div>
    );
  }
}
