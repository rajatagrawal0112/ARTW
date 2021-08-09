<!DOCTYPE html>
<html lang="en">
  

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>ARTW ICO Admin</title>
    <!-- plugins:css -->
    <link rel="stylesheet" href="assets/vendors/mdi/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="assets/vendors/css/vendor.bundle.base.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/custom.css">
    <link rel="stylesheet" href="assets/css/nice-select.css">
     <link rel="stylesheet" href="assets/css/select2.min.css">
    <!-- Font-awesome web fonts with css -->
    <link href="assets/css/fontawesome-all.css" rel="stylesheet" type="text/css"/>
    <!-- End layout styles -->
    <link rel="shortcut icon" href="assets/images/favicon.png" />
    <link href="https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,700,800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/fontawesome.css">
  </head>
  <body class="sidebar-icon-only">
    <div class="container-scroller">
      <!-- partial:partials/_navbar.html -->
      <nav class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a class="navbar-brand brand-logo" href="dashboard.php"><img src="assets/images/logo-white.png" alt="logo" /></a>
          <a class="navbar-brand brand-logo-mini" href="dashboard.php"><img src="assets/images/logo-white.png" alt="logo" /></a>
        </div>
        <div class="navbar-menu-wrapper d-flex align-items-stretch">
          <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span class="mdi mdi-menu"></span>
          </button>
          <div class="search-field d-none d-md-block">
            <form class="d-flex align-items-center h-100" action="#">
              <div class="input-group">
                <div class="input-group-prepend bg-transparent">
                  <i class="input-group-text  mdi mdi-magnify"></i>
                </div>
                <input type="text" class="form-control bg-transparent" placeholder="Search projects">
              </div>
            </form>
          </div>
          <ul class="navbar-nav navbar-nav-right">
            <li class="nav-item nav-profile dropdown">
              <a class="nav-link dropdown-toggle" id="profileDropdown" href="#" data-toggle="dropdown" aria-expanded="false">
                <div class="nav-profile-img">
                  <img src="assets/images/faces/face1.jpg" alt="image">
                  <span class="availability-status online"></span>
                </div>
                <div class="nav-profile-text">
                  <p class="mb-1">John</p>
                </div>
              </a>
              <div class="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                <!-- <a class="dropdown-item" href="my-profile.php">
                  <i class="mdi mdi-account mr-2"></i> My Profile</a> -->
                <a class="dropdown-item" href="change-password.php">
                  <i class="mdi mdi-lock-reset mr-2"></i> Change Password</a>
                 
                <a class="dropdown-item" href="#">
                  <i class="mdi mdi-power mr-2"></i> Logout </a>
              </div>
            </li>
          </ul>
          <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span class="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
      <!-- partial -->
      <div class="container-fluid page-body-wrapper">
        <!-- partial:partials/_sidebar.html -->
        <nav class="sidebar sidebar-offcanvas" id="sidebar">
          <ul class="nav">
            <li class="nav-item nav-profile">
              <a href="#" class="nav-link">
                <div class="nav-profile-image">
                  <img src="assets/images/faces/face1.jpg" alt="profile">
                  <span class="login-status online"></span>
                  <!--change to offline or busy as needed-->
                </div>
                <div class="nav-profile-text d-flex flex-column">
                  <span class="font-weight-bold mb-2">John</span>
                  <span class="text-secondary text-small">Project Manager</span>
                </div>
               <!--  <i class="mdi mdi-bookmark-check text-success nav-profile-badge"></i> -->
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="dashboard.php">
                <span class="menu-title">Dashboard</span>
                <i class="mdi mdi-home menu-icon"></i>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                <span class="menu-title">General Pages</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-settings menu-icon"></i>
              </a>
              <div class="collapse" id="ui-basic">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="home-banner-details.php">Home Banner</a></li>
                  
                  <li class="nav-item"> <a class="nav-link" href="key-features.php">Key Features</a></li>
                  <li class="nav-item"> <a class="nav-link" href="problem.php">Problems</a></li>
                  <li class="nav-item"> <a class="nav-link" href="solution.php">Solutions</a></li>
                   <li class="nav-item"> <a class="nav-link" href="token-allocation.php">Token Allocation</a></li>
                    <!-- <li class="nav-item"> <a class="nav-link" href="partner-list.php">Partners</a></li> -->

                  <li class="nav-item"> <a class="nav-link" href="roadmap.php">Roadmap</a></li>

                  <li class="nav-item"> <a class="nav-link" href="whitepaper.php">Whitepaper</a></li>

                  <li class="nav-item"> <a class="nav-link" href="our-team.php">Our Team</a></li>

                  <li class="nav-item"> <a class="nav-link" href="blog-list.php">Blogs</a></li>

                  
                 
                 <!--  <li class="nav-item"> <a class="nav-link" href="how-to-work.php">How It Work</a></li> -->
                  <li class="nav-item"> <a class="nav-link" href="faq-list.php">FAQ</a></li>

                   
                  
                  
                  
                </ul>
              </div>
            </li>
              <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic1" aria-expanded="false" aria-controls="ui-basic">
                <span class="menu-title">Legal</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-hammer menu-icon"></i>
              </a>
              <div class="collapse" id="ui-basic1">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="terms-n-conditons.php">Terms & Conditions</a></li>
                  <li class="nav-item"> <a class="nav-link" href="privacy-policy.php">Privacy Policy</a></li>
                  <li class="nav-item"> <a class="nav-link" href="cookie-policy.php">Cookie Policy</a></li>
                  <li class="nav-item"> <a class="nav-link" href="referral-policy.php">Referral policy</a></li>
                </ul>
              </div>
            </li>
          
        

              <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic1" aria-expanded="false" aria-controls="ui-basic">
                <span class="menu-title">Contact Info</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-phone menu-icon"></i>
              </a>
              <div class="collapse" id="ui-basic1">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="contact-list.php">Contact Us</a></li>
                  <li class="nav-item"> <a class="nav-link" href="basic-details.php">Basic Details</a></li>
                  <li class="nav-item"> <a class="nav-link" href="feedback-list.php">Feedback List</a></li>
                </ul>
              </div>
            </li>

               <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic1" aria-expanded="false" aria-controls="ui-basic">
                <span class="menu-title">User Details</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-file-document menu-icon"></i>
              </a>
              <div class="collapse" id="ui-basic1">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="user-list.php">User List</a></li>
                  <li class="nav-item"> <a class="nav-link" href="order-history.php">Order History</a></li>
                </ul>
              </div>
            </li>


              <li class="nav-item">
              <a class="nav-link" data-toggle="collapse" href="#ui-basic1" aria-expanded="false" aria-controls="ui-basic">
                <span class="menu-title">ART Details</span>
                <i class="menu-arrow"></i>
                <i class="mdi mdi-cash menu-icon"></i>
              </a>
              <div class="collapse" id="ui-basic1">
                <ul class="nav flex-column sub-menu">
                  <li class="nav-item"> <a class="nav-link" href="referral-table.php">Referral</a></li>
                  <li class="nav-item"> <a class="nav-link" href="update-token.php">Update Tokenomics</a></li>
                  <li class="nav-item"> <a class="nav-link" href="summary.php">ARTW List</a></li>
                  <li class="nav-item"> <a class="nav-link" href="bonus-persent.php">Referral Bonus %</a></li>
                </ul>
              </div>
            </li>



             <li class="nav-item">
              <a class="nav-link" href="transaction-table.php">
                <span class="menu-title">Transaction History</span>
                <i class="mdi mdi-file menu-icon"></i>
              </a>
            </li>

            

           
          

          </ul>
        </nav>
        <!-- partial -->
        <div class="main-panel">
          <div class="content-wrapper">
