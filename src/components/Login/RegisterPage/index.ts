import { connect } from "react-redux";

import { asyncRegister } from "components/Login/Redux/LoginActions";
import Register, {
  RegisterStateProps,
} from "components/Login/RegisterPage/RegisterComponent";
import { reset } from "rootActions";
import { StoreState } from "types";
import { StoreStateDispatch } from "types/Redux/actions";

function mapStateToProps(state: StoreState): RegisterStateProps {
  return {
    inProgress: state.loginState.registerAttempt,
    success: state.loginState.registerSuccess,
    failureMessage: state.loginState.registerFailure,
  };
}

function mapDispatchToProps(dispatch: StoreStateDispatch) {
  return {
    register: (
      name: string,
      username: string,
      email: string,
      password: string
    ) => {
      dispatch(asyncRegister(name, username, email, password));
    },
    reset: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);