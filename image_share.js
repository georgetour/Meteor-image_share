//We are making a varable called Images for mongo and its name in mongo it will be
//images
Images = new Mongo.Collection("images");
console.log(Images.find().count());

if (Meteor.isClient) {
    //We are storing to the session a variable called imageLimit with the value of 8
    //so we can use it below to show only 8 images
    var a = 10 ==5;
    console.log(a);
    Session.set("imageLimit",8);

    lastScroll=0;
    $(window).scroll(function(event){
        //test if we are near the bottom of the window
        if($(window).scrollTop()+$(window).height()> $(document).height()-100)
        {
            var scrollTop = $(this).scrollTop();
            if(scrollTop>lastScroll){
                Session.set("imageLimit",Session.get("imageLimit")+4);
            }
            lastScroll= scrollTop;
        }
    });


    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

   //Template.images.helpers({images:img_data});

    //With the code below we are saying at template images at images put Images,find() which it means everything
    //and then sort them by the biggest
   Template.images.helpers({
       images:function(){
           if(Session.get("userFilter")){//They set a filter
               return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1,rating:-1}});
           }
           else{
               return Images.find({},{sort:{createdOn:-1,rating:-1},limit:Session.get("imageLimit")});
           }
       },
       //We need to get to the database and get that user out
       getUser:function(user_id){
           var user= Meteor.users.findOne({_id:user_id});//The _id equals with user_id
           if(user){
               return user.username;
           }
            else{
               return "anonymous";
           }
       },
       filtering_images:function(){
           if(Session.get("userFilter")){//They set a filter
           return true;
       }
           else{
               return false;
           }
       },
       getFilterUser:function(){
           if(Session.get("userFilter")){//They set a filter
               var user = Meteor.users.findOne({_id:Session.get("userFilter")});
               return user.username;
           }
           else{
               return false;
           }
       }

   });

    //We are saying at body find the username then if Meteor user is true give the email address else anonymous
    Template.body.helpers({
        username:function(){
        if(Meteor.user()){
            return Meteor.user().username;

        }
        else {
            return "anonymous user";
        }
    }

    });

   Template.images.events({

      'click .js-del-image':function(event)
      {
         var image_id=this._id;
         console.log(image_id);
         $("#"+image_id).hide('slow',function(){
            Images.remove({"_id":image_id});
         });
      },
       'click .js-stars-image':function(event){
           var rating=$(event.currentTarget).data("userrating");
           console.log(rating);
           //With this.id it gets the unique id for the data in the template
           var image_id=this['data-id'];
           console.log(image_id);

            Images.update({_id:image_id},
               {$set:{rating:rating}});

            },
       'click .js-show-image-form':function(){
            $("#image-form-modal").modal('show');
       },
       'click .js-image-user-filter':function(){
           Session.set("userFilter",this.createdBy);
       },
       'click .js-remove-filter':function() {
           Session.set("userFilter", undefined);
       }

    });

    Template.image_add_form.events({
        'submit .js-add-image':function(event){
        var img_src,img_alt;
            img_src = event.target.img_src.value;
            img_alt = event.target.img_alt.value;
            console.log(" src: "+img_src+" alt: "+img_alt);
            if(Meteor.user()){
                Images.insert({
                    img_src:img_src,
                    img_alt:img_alt,
                    createdOn:new Date(),
                    createdBy:Meteor.user()._id
                })
            }

            //if we don t add this the browser will run very fast and reload and we won t be able to see the console log
            return false;
        }
    });


}

if (Meteor.isServer) {
   console.log("I am the server");
}




