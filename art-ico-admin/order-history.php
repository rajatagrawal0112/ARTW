<?php include('header.php');?>

  <div class="heading-row mb-20">
    <div class="row align-item-center">
       <div class="col-lg-6">
          <h3 class="page-title"><span class="page-title-icon bg-gradient-primary text-white mr-2"><i class="mdi mdi-history"></i></span> Order History </h3>
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
                        <option>User Name</option>
                        <option>Willian Smith</option>
                        <option>Dia Firdaus</option>
                        <option>Zimmy Wu</option>
                      </select>
                  </div>
            </div> 
            <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new2" class="form-control">
                        <option>Tx ID</option>
                        <option>DE1002</option>
                        <option>FV3485</option>
                        
                      </select>
                  </div>
            </div>  
            <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new3" class="form-control">
                        <option>Reffered By</option>
                        <option>Willian Smith</option>
                        <option>Dia Firdaus</option>
                        <option>Zimmy Wu</option>
                      </select>
                  </div>
            </div> 
             <div class="col-md-2">
                  <div class="form-group">
                    <select id="select-new4" class="form-control">
                        <option>Created Date</option>
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
                <th width="10%">Order ID</th>
                <th width="10%">Email</th>
                <th width="10%">Wallet Address</th>
                <th width="5%">Tx Hash</th>
                <th width="10%">Payment Method</th>
                <th width="5%">Tot Base</th>
                <th width="10%">Currency Received</th>
                <th width="10%">ARTW sent</th>
                <th width="10%">Payment Status</th>
                <th width="10%">Order Status</th>
                
                <th width="5%">Action</th>


              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>De11202</td>
                <td>John Doe</td>
                <td>8675867586</td>
                <td>xyz</td>
                <td>5000</td>
                <td>500</td>
                <td>500</td>
                <td>Pending</td>
                <td>Pending</td>
                <td>Online</td>
                   <td>
                  <div class="edit-icons">
                   
                    <a href="order-details.php" data-toggle="tooltip" data-placement="top" title="Delete"><i class="mdi mdi-eye"></i></a>
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
$(document).ready( function () {
  $('.table').DataTable();
} );
</script>