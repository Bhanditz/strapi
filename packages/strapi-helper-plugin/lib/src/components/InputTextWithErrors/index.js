import React from 'react';
import PropTypes from 'prop-types';
import { includes, isEmpty, mapKeys, reject } from 'lodash';
import cn from 'classnames';

// Design
import Label from 'components/Label';
import InputText from 'components/InputText';

import styles from './styles.scss';

class InputTextWithErrors extends React.Component { // eslint-disable-line react/prefer-stateless-function
  state = { errors: [], hasInitialValue: false };

  componentDidMount() {
    const { value, errors } = this.props;

    // Prevent the input from displaying an error when the user enters and leaves without filling it
    if (value && !isEmpty(value)) {
      this.setState({ hasInitialValue: true });
    }

    // Display input error if it already has some
    if (!isEmpty(errors)) {
      this.setState({ errors });
    }
  }

  componentWillReceiveProps(nextProps) {
    // Check if errors have been updated during validations
    if (nextProps.didCheckErrors !== this.props.didCheckErrors) {
      // Remove from the state the errors that have already been set
      const errors = isEmpty(nextProps.errors) ? [] : nextProps.errors;
      this.setState({ errors });
    }
  }

  /**
   * Set the errors depending on the validations given to the input
   * @param  {Object} target
   */
  handleBlur = ({ target }) => {
    // Prevent from displaying error if the input is initially isEmpty
    if (!isEmpty(target.value) || this.state.hasInitialValue) {
      const errors = this.validate(target.value);
      this.setState({ errors, hasInitialValue: true });
    }
  }

  render() {
    const { autoFocus, inputClassName, name, onChange, placeholder, value } = this.props;

    return (
      <div className={cn(
          styles.container,
          this.props.customBootstrapClass || 'col-md-6',
          this.props.className,
        )}
      >
        <Label htmlFor={name} message={this.props.label && this.props.label.message || this.props.label} />
        <InputText
          autoFocus={autoFocus}
          className={inputClassName}
          errors={this.state.errors}
          name={name}
          onBlur={this.handleBlur}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </div>
    );
  }

  validate = (value) => {
    const requiredError = { id: 'components.Input.error.validation.required' };
    let errors = [];

    mapKeys(this.props.validations, (validationValue, validationKey) => {
      switch (validationKey) {
        case 'maxLength': {
          if (value.length > validationValue) {
            errors.push({ id: 'components.Input.error.validation.maxLength' });
          }
          break;
        }
        case 'minLength': {
          if (value.length < validationValue) {
            errors.push({ id: 'components.Input.error.validation.minLength' });
          }
          break;
        }
        case 'required': {
          if (value.length === 0) {
            errors.push({ id: 'components.Input.error.validation.required' });
          }
          break;
        }
        default:
          errors = [];
      }
    });

    if (includes(errors, requiredError)) {
      errors = reject(errors, (error) => error !== requiredError);
    }

    return errors;
  }
}

InputTextWithErrors.defaultProps = {
  customBootstrapClass: false,
  didCheckErrors: false,
  errors: [],
  inputClassName: '',
  placeholder: 'app.utils.placeholder.defaultMessage',
  validations: {},
};

InputTextWithErrors.propTypes = {
  customBootstrapClass: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  didCheckErrors: PropTypes.bool,
  errors: PropTypes.array,
  inputClassName: PropTypes.string,
  validations: PropTypes.object,
  value: PropTypes.string.isRequired
};

export default InputTextWithErrors;