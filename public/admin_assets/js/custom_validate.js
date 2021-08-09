
   function lettersOnly(evt)
   {
        
          /* var charCode = evt.keyCode || evt.which;

           if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode==32 || charCode==9)

               return true;
           else
               return false;*/
        return true;
  }
    
    function isNumberKey(evt)
    {
                 var charCode = (evt.which) ? evt.which : evt.keyCode

                // alert(charCode);
                 if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false;
                 return true;
    }

 function isNumdeciKey(evt)
      {
         var charCode = (evt.which) ? evt.which : evt.keyCode;
         if (charCode != 46 && charCode > 31 
           && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }


      function lettersRegOnly(evt)
   {
        
           var charCode = evt.keyCode || evt.which;

           if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode==32 || charCode==9)

               return true;
           else
               return false;
        return true;
  }

