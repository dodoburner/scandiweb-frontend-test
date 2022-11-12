import { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
  }

  handleCategoryClick(value) {
    this.props.updateCurrentCategory(value);
  }

  render() {
    const { categories, currentCategory } = this.props.state;

    return (
      <ul className="category-list">
        {categories.map((category) => {
          const headerActive = currentCategory.name === category.name;
          return (
            <li
              className={headerActive ? "header-active" : ""}
              key={category.name}
              onClick={() => this.handleCategoryClick(category)}
            >
              <Link to="/"> {category.name}</Link>
              {headerActive ? <div className="header-active-line"></div> : null}
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Nav;
