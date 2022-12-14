import React, { Component } from "react";
import PropTypes from "prop-types";
import iconDown from "../assets/icon-down.png";
import iconUp from "../assets/icon-up.png";
import { connect } from "react-redux";
import { updateCurrentCurrency } from "../redux/cartSlice";
import { getCurrencies } from "../data";
import { client } from "..";

class CurrencyMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyMenuOpen: false,
      currencies: null,
    };
    this.renderCurrencies = this.renderCurrencies.bind(this);
    this.handleCurrencyClick = this.handleCurrencyClick.bind(this);
    this.handleOpenCurrencyMenu = this.handleOpenCurrencyMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleCurrencyClick(value) {
    this.props.updateCurrentCurrency(value);
  }

  handleOpenCurrencyMenu() {
    this.setState((prevState) => ({
      currencyMenuOpen: !prevState.currencyMenuOpen,
    }));
  }

  renderCurrencies() {
    const { currencies } = this.state;
    return currencies?.map((currency) => {
      const { symbol, label } = currency;
      return (
        <li
          onClick={() => this.handleCurrencyClick(symbol)}
          key={symbol}
          className="currency-menu-value"
        >
          {symbol} {label}
        </li>
      );
    });
  }

  handleClickOutside(e) {
    const CLASSES = [
      "currency-menu",
      "currency-menu-arrow",
      "currency-menu-value",
    ];
    if (!CLASSES.includes(e.target.className)) {
      this.setState({ currencyMenuOpen: false });
    }
  }

  componentDidMount() {
    client
      .query({
        query: getCurrencies,
      })
      .then((res) => {
        this.setState({ currencies: res.data.currencies });
      });
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  render() {
    const { currentCurrency } = this.props;
    const { currencyMenuOpen } = this.state;

    return (
      <div className="currency-menu" onClick={this.handleOpenCurrencyMenu}>
        {currentCurrency}
        <img
          src={currencyMenuOpen ? iconUp : iconDown}
          alt="icon-down"
          className="currency-menu-arrow"
        />

        <ul className="currency-dropdown">
          {currencyMenuOpen ? this.renderCurrencies() : null}
        </ul>
      </div>
    );
  }
}

CurrencyMenu.propTypes = {
  currentCurrency: PropTypes.string,
  updateCurrentCurrency: PropTypes.func,
  getCurrencies: PropTypes.func,
};

const mapDispatchToProps = {
  updateCurrentCurrency,
  getCurrencies,
};

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyMenu);
