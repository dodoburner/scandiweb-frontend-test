import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Product from "../components/Product";
import withRouter from "../hoc/withRouter";
import _ from "lodash";
import parse from "html-react-parser";
import { addToCart } from "../redux/cartSlice";
import {
  fetchProduct,
  updateSelectedAttribute,
  removeProduct,
} from "../redux/productPDPSlice";
import ErrorPage from "./ErrorPage";

class ProductPage extends Component {
  constructor(props) {
    super(props);
    this.updateImg = this.updateImg.bind(this);
    this.state = {
      img: null,
    };
  }

  componentDidMount() {
    this.props.fetchProduct(this.props.params.id);
  }

  componentDidUpdate() {
    const { status } = this.props;
    if (status === "succeeded" && !this.state.img) {
      this.setState({ img: this.props.product.gallery[0] });
    }
  }

  componentWillUnmount() {
    this.props.removeProduct();
  }

  updateImg(img) {
    this.setState({ img });
  }

  render() {
    const { img } = this.state;
    const { product, status } = this.props;
    const { currentCurrency } = this.props;
    const price = product
      ? product.prices.find((el) => el.currency.symbol === currentCurrency)
      : null;
    const { addToCart } = this.props;

    if (status === "failed") {
      return <ErrorPage />;
    } else if (status === "succeeded") {
      return (
        <div className="product-page">
          <div className="product-large">
            <div className="product-page-imgs">
              {product.gallery.map((img) => {
                return (
                  <img
                    className="product-page-img-small"
                    src={img}
                    alt={product.name}
                    onClick={() => this.updateImg(img)}
                    key={img}
                  />
                );
              })}
            </div>

            <div className="product-page-img-container">
              {!product.inStock && (
                <div className="out-of-stock">OUT OF STOCK</div>
              )}
              <img className="product-page-img" src={img} alt={product.name} />
            </div>

            <div>
              <Product product={product} />
              <p className="product-page-price">PRICE:</p>
              <p className="product-price">
                {currentCurrency}
                {price.amount.toFixed(2)}
              </p>
              {product.inStock ? (
                <button
                  onClick={() => addToCart(_.cloneDeep(product))}
                  className="add-to-cart-btn"
                >
                  ADD TO CART
                </button>
              ) : (
                <button className="add-to-cart-btn out-of-stock-btn">
                  ADD TO CART
                </button>
              )}

              <div className="description"> {parse(product.description)} </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

ProductPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
  currentCurrency: PropTypes.string,
  addToCart: PropTypes.func,
  fetchProduct: PropTypes.func,
  removeProduct: PropTypes.func,
  product: PropTypes.object,
  status: PropTypes.string,
};

const mapStateToProps = (state) => ({
  currentCurrency: state.cart.currentCurrency,
  product: state.productPDP.details,
  status: state.productPDP.status,
});

const mapDispatchToProps = {
  addToCart,
  fetchProduct,
  updateSelectedAttribute,
  removeProduct,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductPage)
);
