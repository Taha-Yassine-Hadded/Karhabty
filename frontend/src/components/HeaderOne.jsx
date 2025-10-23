import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const bannerDismissed = localStorage.getItem('loginBannerDismissed');
    const currentPath = location.pathname;
    
    // Hide banner on login and signup pages
    const isAuthPage = currentPath === '/login' || currentPath === '/signup';
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setShowLoginBanner(false); // Hide banner if user is logged in
    } else if (isAuthPage) {
      setShowLoginBanner(false); // Hide banner on login/signup pages
    } else {
      // Show banner only if user is not logged in, hasn't dismissed it, and not on auth pages
      setShowLoginBanner(bannerDismissed !== 'true');
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
  }, [location.pathname]);

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

  const handleBannerDismiss = () => {
    setShowLoginBanner(false);
    localStorage.setItem('loginBannerDismissed', 'true');
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
                <img src="/assets/img/logo1.png" style={{ width: "180px", height: "auto" }}  alt="Fixturbo" />
              </Link>
            </div>
            <div className="container">
              <div className="row align-items-center justify-content-lg-between">
                <div className="col-auto d-xl-none d-block">
                  <div className="header-logo">
                    <Link to="/">
                      <img src="/assets/img/logo1.png" style={{ width: "180px", height: "auto" }} alt="Fixturbo" />
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
                      {user && user.role !== 'admin' && (
                        <>
                          <li>
                            <NavLink
                              to="/my-cars"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Cars
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/recommendations"
                              className={(navData) =>
                                navData.isActive ? "active" : ""
                              }
                            >
                              Recommendations
                            </NavLink>
                          </li>
                        </>
                      )}
                      <li>
                        <NavLink
                          to="/suppliers"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          Our Suppliers
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/technicians"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          Our Technicians
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
                              <>
                                <li>
                                  <Link to="/my-cars" onClick={handleDropdownItemClick}>
                                    <i className="fas fa-car"></i> <span>My Cars</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/recommendations" onClick={handleDropdownItemClick}>
                                    <i className="fas fa-lightbulb"></i> <span>My Recommendations</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/suppliers" onClick={handleDropdownItemClick}>
                                    <i className="fas fa-building"></i> <span>Our Suppliers</span>
                                  </Link>
                                </li>
                                <li>
                                  <Link to="/technicians" onClick={handleDropdownItemClick}>
                                    <i className="fas fa-wrench"></i> <span>Our Technicians</span>
                                  </Link>
                                </li>
                              </>
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
                        <Link to={authButton.link} className="btn d-none d-lg-inline-block">
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
                <img src="/assets/img/logo1.png" alt="Karhabty" />
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
                    to="/suppliers"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    Suppliers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/technicians"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    Technicians
                  </NavLink>
                </li>
                {user && user.role !== 'admin' && (
                  <>
                    <li>
                      <NavLink
                        to="/my-cars"
                        className={(navData) => (navData.isActive ? "active" : "")}
                        onClick={mobileMenu}
                      >
                        Cars
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/recommendations"
                        className={(navData) => (navData.isActive ? "active" : "")}
                        onClick={mobileMenu}
                      >
                        Recommendations
                      </NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink
                    to="/about"
                    className={(navData) => (navData.isActive ? "active" : "")}
                    onClick={mobileMenu}
                  >
                    About
                  </NavLink>
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
                      <>
                      <li>
                        <NavLink
                          to="/my-cars"
                          className={(navData) => (navData.isActive ? "active" : "")}
                          onClick={mobileMenu}
                        >
                          <i className="fas fa-car"></i> My Cars
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to="/recommendations"
                          className={(navData) => (navData.isActive ? "active" : "")}
                          onClick={mobileMenu}
                        >
                          <i className="fas fa-lightbulb"></i> My Recommendations
                        </NavLink>
                      </li>
                      </>
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

      {/* Login Banner for Non-Logged-In Users */}
      {showLoginBanner && (
        <div 
          className="w-ful text-white" 
          style={{ 
            background: '#e8092e',
            marginTop: '90px',
            minHeight: '80px', 
            padding: '14px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            zIndex: 10,
            top: 85,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-4" style={{ width: '100%' }}>
            <div className="flex items-center gap-4 flex-1 justify-center">
              <div className="flex-1" style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: '600', color: 'white', fontSize: '15px', marginBottom: '4px', lineHeight: '1.4' }}>
                  Login to manage your cars and get personalized recommendations!
                </p>
                <p style={{ fontSize: '16px', color: 'white', lineHeight: '1.4' }}>
                  Access exclusive features like car management and expert recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                style={{
                  backgroundColor: 'white',
                  color: '#dc2626',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                Login Now
              </Link>
              <button
                onClick={handleBannerDismiss}
                style={{
                  color: 'white',
                  padding: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Dismiss banner"
              >
                <i className="fas fa-times" style={{ fontSize: '18px' }}></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderOne;