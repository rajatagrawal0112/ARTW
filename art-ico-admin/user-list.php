<?php include('header.php');?>

  <div class="heading-row mb-20">
    <div class="row align-item-center">
       <div class="col-lg-6">
          <h3 class="page-title"><span class="page-title-icon bg-gradient-primary text-white mr-2"><i class="mdi mdi-file-image"></i></span> User List </h3>
       </div>
  </div>
  </div>
  <div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
      <div class="card">
         <div class="card-header">
           <div class="row">
            <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new" class="form-control">
                        <option>Name</option>
                        <option>Willian Smith</option>
                        <option>Dia Firdaus</option>
                        <option>Zimmy Wu</option>
                      </select>
                  </div>
            </div> 
            <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new2" class="form-control">
                        <option>Unique ID</option>
                        <option>DE1002</option>
                        <option>FV3485</option>
                        
                      </select>
                  </div>
            </div>  
            <div class="col-md-2">
                  <div class="form-group">
                    <div class="form-group">
                       <input type="text" class="form-control" id="datepicker" placeholder="Register On">
                      </div>
                  </div>
            </div> 
             <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new4" class="form-control">
                        <option>Refferd By</option>
                        <option>Willian Smith</option>
                        <option>Dia Firdaus</option>
                        <option>Zimmy Wu</option>
                      </select>
                  </div>
            </div> 
             
                        
         </div>
         </div> 
        <div class="card-body table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th width="5%">S. No.</th>
                <th width="10%">unique ID</th>
                <th width="10%">Name</th>
                <th width="10%">Email</th>
                <th width="15%">Registered on</th>
                <th width="10%">Referred by</th>
                <th width="10%" class="text-success">Earned</th>
                <th width="10%" class="text-danger">Spent</th>
                
                <th width="10%">Mobile Number</th>
                <th width="10%">Action</th>


              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>DE1002</td>
                <td>John Doe</td>
                <td>abc@gmail.com</td>
                <td>30 June, 2019 | 2:00 PM</td>
                <td>abc</td>
                <td class="text-success">+77.99</td>
                 <td class="text-danger">+77.99</td>
                <td>67857685768</td>
                
                 <td>
                  <div class="edit-icons">
                   
                    <a href="transaction-table.php"><i class="mdi mdi-eye"></i></a>
                  </div>
                </td>
              </tr>

               
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

<?php include('footer.php');?>

  <script>
  $( function() {
    $( "#datepicker" ).datepicker();
  } );
  </script>
  <script>
$(document).ready( function () {
  $('.table').DataTable();
} );
</script>