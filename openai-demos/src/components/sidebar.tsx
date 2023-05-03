import { Link } from "react-router-dom";
import { ISettings } from "../interfaces";
import { SetStateAction } from "react";

const w100 = {
  width: 50,
};

const SideBar = (props: { settings: any; handler: any }) => {
  const handleEvent = (e: any, prop: string) => {
    const val = e.target.value;
    let prevState = { ...props.settings, [prop]: val };
    console.info(prop, prevState);
    props.handler(prevState);
  };

  const handleChecked = (e: any, prop: string) => {
    const val = e.target.checked;
    let prevState = { ...props.settings, [prop]: val };
    console.info(prop, prevState);
    props.handler(prevState);
  };

  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <Link
          to="/"
          className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <span className="fs-5 d-none d-sm-inline">Menu</span>
        </Link>
        <ul
          className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item">
            <Link to="/" className="nav-link align-middle px-0">
              <i className="fs-4 bi-house"></i>{" "}
              <span className="ms-1 d-none d-sm-inline">Home</span>
            </Link>
          </li>
          <li>
            <Link to="/products" className="nav-link px-0 align-middle">
              <i className="fs-4 bi-grid"></i>{" "}
              <span className="ms-1 d-none d-sm-inline">Products</span>
            </Link>
          </li>
          <li>
            <Link to="/guides" className="nav-link px-0 align-middle">
              <i className="fs-4 bi-globe"></i>{" "}
              <span className="ms-1 d-none d-sm-inline">Travel Guides</span>
            </Link>
          </li>
          <li>
            <Link to="/translation" className="nav-link px-0 align-middle">
              <i className="fs-4 bi-globe"></i>{" "}
              <span className="ms-1 d-none d-sm-inline">Translation</span>
            </Link>
          </li>
          <li className="d-none d-sm-block">
            <section className="p-2">
              <div className="areaTitle mb-2">Settings</div>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label htmlFor="temperature" className="form-label w100">
                    Temperature
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="temperature"
                    aria-describedby="emailHelp"
                    value={props.settings.temperature}
                    onChange={(e) => handleEvent(e, "temperature")}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="max_tokens" className="form-label w100">
                    Max Tokens
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="max_tokens"
                    value={props.settings.max_tokens}
                    onChange={(e) => handleEvent(e, "max_tokens")}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    value={props.settings.sensitive}
                    onChange={(e) => handleChecked(e, "sensitive")}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Sensitive
                  </label>
                </div>
              </form>
            </section>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
