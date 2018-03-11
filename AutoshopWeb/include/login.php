
    <?php # DISPLAY COMPLETE LOGIN PAGE.

    # Set page title and display header section.
    $page_title = 'Login' ;
    include ( 'header.php' ) ;

    # Display any error messages if present.
    if ( isset( $errors ) && !empty( $errors ) )
    {
     echo '<p id="err_msg">There was a problem:<br>' ;
     foreach ( $errors as $msg ) { echo " - $msg<br>" ; }
     echo 'Please try again or register</p>' ;
    }
    ?>


    <div class="jumbotron jumbotron-fluid">
    </div>
            <form class="form-signin" action="login_action.php" method="post">
            <h2 class="form-signin-heading">Login</h2>
            <input type="text" class="form-control" name="email" placeholder="Email"name="email" required="" autofocus="" />
            <input type="password" class="form-control" name="pass" placeholder="Password" required=""/>
            <label class="checkbox">
              <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe"> Remember me
            </label>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
          </form>

        <!-- Page Content -->
        <section class="py-5">

        </section>

    <!-- Footer -->
    <footer class="py-5 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">Copyright &copy; Autoshop 2018</p>
      </div>
      <!-- /.container -->
    </footer>

    <!-- Bootstrap core JavaScript -->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  </body>

</html>
