import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    var offCanvasNav = document.getElementById("offcanvas-navigation");
    if (offCanvasNav) {
      var offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");

      for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
        offCanvasNavSubMenu[i].insertAdjacentHTML(
          "beforebegin",
          "<span class='mean-expand-class'>+</span>"
        );
      }

      var menuExpand = offCanvasNav.querySelectorAll(".mean-expand-class");
      var numMenuExpand = menuExpand.length;

      function sideMenuExpand() {
        if (this.parentElement.classList.contains("active") === true) {
          this.parentElement.classList.remove("active");
        } else {
          for (let i = 0; i < numMenuExpand; i++) {
            menuExpand[i].parentElement.classList.remove("active");
          }
          this.parentElement.classList.add("active");
        }
      }

      for (let i = 0; i < numMenuExpand; i++) {
        menuExpand[i].addEventListener("click", sideMenuExpand);
      }
    }

    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const mobileMenu = () => {
    setActive(!active);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserDropdown(false);
    navigate('/');
  };

  const toggleUserDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserDropdown(!showUserDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-profile-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showUserDropdown) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showUserDropdown]);

  const handleDropdownItemClick = () => {
    setShowUserDropdown(false);
  };

  // Determine button text and link based on current route and user status
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";
  
  const getAuthButton = () => {
    if (user) return null; // Don't show auth button if logged in
    if (isLoginPage) return { text: "Sign Up", link: "/signup" };
    if (isSignupPage) return { text: "Login", link: "/login" };
    return { text: "Login", link: "/login" };
  };

  const authButton = getAuthButton();

  return (
    <>
      <header className="nav-header header-layout1">
        <div className={`sticky-wrapper ${scroll && "sticky"}`}>
          {/* Main Menu Area */}
          <div className="menu-area">
            <div className="header-navbar-logo">
              <Link to="/">
                <img src="assets/img/logo-white.svg" alt="Fixturbo" />
              </Link>
            </div>
            <div className="container">
              <div className="row align-items-center justify-content-lg-between">
                <div className="col-auto d-xl-none d-block">
                  <div className="header-logo">
                    <Link to="/">
                      <img src="assets/img/logo-white.svg" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
                <div className="col-auto">
                  <nav className="main-menu d-none d-lg-inline-block">
                    <ul>
                      <li>
                        <NavLink
                          to="/"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          Home
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/about"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          About Us
                        </NavLink>
                      </li>
                      <li className="menu-item-has-children">
                        <Link to="#">Services</Link>
                        <ul className="sub-menu">
                          <li>
                            <NavLink
                              to="/service"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Service
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/service-details"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Service Details
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item-has-children">
                        <Link to="#">Projects</Link>
                        <ul className="sub-menu">
                          <li>
                            <NavLink
                              to="/project"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Projects
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/project-details"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Projects Details
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item-has-children">
                        <Link to="#">Blog</Link>
                        <ul className="sub-menu">
                          <li>
                            <NavLink
                              to="/blog"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Blog
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/blog-details"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Blog Details
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                      <li className="menu-item-has-children">
                        <Link to="#">Pages</Link>
                        <ul className="sub-menu">
                          <li>
                            <NavLink
                              to="/team"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Team Page
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/team-details"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Team Details
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/shop"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Shop Page
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/shop-details"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Shop Details
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/cart"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Cart
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/checkout"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Checkout
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/wishlist"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Wishlist
                            </NavLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <NavLink
                          to="/contact"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          Contact
                        </NavLink>
                      </li>
                    </ul>
                  </nav>
                  <div className="navbar-right d-inline-flex d-lg-none">
                    <button
                      type="button"
                      className="menu-toggle icon-btn"
                      onClick={mobileMenu}
                    >
                      <i className="fas fa-bars" />
                    </button>
                  </div>
                </div>
                <div className="col-auto ms-auto">
                  <div className="navbar-right-desc">
                    {user ? (
                      <div className="user-profile-dropdown">
                        <button 
                          className="user-profile-btn"
                          onClick={toggleUserDropdown}
                          type="button"
                        >
                          <img 
                            src={user.avatar || "/assets/img/default-user.png"} 
                            alt="Profile"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="user-avatar-fallback">
                            <i className="fas fa-user"></i>
                          </div>
                          <span className="user-name">{user.name || "User"}</span>
                          <i className={`fas fa-chevron-down ${showUserDropdown ? 'rotated' : ''}`}></i>
                        </button>
                        <div className={`dropdown-menu ${showUserDropdown ? 'show' : ''}`}>
                          <div className="user-info">
                            <h4>{user.name || "User"}</h4>
                            <p>{user.email || "user@example.com"}</p>
                          </div>
                          <ul>
                            {user.role !== 'admin' && (
                              <li>
                                <Link to="/profile" onClick={handleDropdownItemClick}>
                                  <i className="fas fa-user-alt"></i> <span>Profile</span>
                                </Link>
                              </li>
                            )}
                            {user.role === 'admin' && (
                              <li>
                                <Link to="/admin" onClick={handleDropdownItemClick}>
                                  <i className="fas fa-tachometer-alt"></i> <span>Dashboard</span>
                                </Link>
                              </li>
                            )}
                            <li className="divider"></li>
                            <li>
                              <button onClick={handleLogout} type="button">
                                <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      authButton && (
                        <Link to={authButton.link} className="btn">
                          {authButton.text}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="logo-bg" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-wrapper ${active && "body-visible"}`}>
          <div className="mobile-menu-area">
            <div className="mobile-logo">
              <Link to="/">
                <img src="assets/img/logo.svg" alt="Fixturbo" />
              </Link>
              <button className="menu-toggle" onClick={mobileMenu}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="mobile-menu">
              <ul id="offcanvas-navigation">
                <li>
                  <NavLink
                    to="/"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    About
                  </NavLink>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Pages</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/team"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Team Page
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/team-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Team Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Shop Page
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Shop Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/cart"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Cart
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/checkout"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Checkout
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/wishlist"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Wishlist
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Project</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/project"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Projects
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/project-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Project Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Service</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/service"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Service
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/service-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Service Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Shop</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/shop"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Shop
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Shop Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/cart"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Cart
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/checkout"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Checkout
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/wishlist"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Wishlist
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Blog</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/blog"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Blog
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/blog-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                        onClick={mobileMenu}
                      >
                        Blog Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    Contact
                  </NavLink>
                </li>
                
                {/* Mobile Auth Section */}
                {user ? (
                  <li className="mobile-auth-section">
                    <div className="mobile-user-info">
                      <div className="mobile-user-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="mobile-user-details">
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <ul>
                      {user.role !== 'admin' && (
                      <li>
                        <NavLink
                          to="/profile"
                          className={(navData) => (navData.isActive ? "active" : "")}
                          onClick={mobileMenu}
                        >
                          <i className="fas fa-user"></i> Profile
                        </NavLink>
                      </li>
                      )}
                      {user.role === 'admin' && (
                        <li>
                          <NavLink
                            to="/admin"
                            className={(navData) => (navData.isActive ? "active" : "")}
                            onClick={mobileMenu}
                          >
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                          </NavLink>
                        </li>
                      )}
                      <li>
                        <button 
                          className="mobile-logout-btn" 
                          onClick={() => {
                            handleLogout();
                            mobileMenu();
                          }}
                          type="button"
                        >
                          <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                ) : (
                  authButton && (
                    <li className="mobile-auth-section">
                      <NavLink
                        to={authButton.link}
                        className={(navData) => (navData.isActive ? "active" : "")}
                        onClick={mobileMenu}
                      >
                        {authButton.text}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderOne;