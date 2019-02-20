const express= require('express');
const mongoose= require('mongoose');
const router= express.Router();
const {ensureAuthenticated}=require('../helper/auth');


//load Idea model
//. means we are looking at current directory
require('../models/Idea');
const Idea=mongoose.model('ideas');


// Idea Index Page
router.get('/',ensureAuthenticated,(req,res)=>{
    //only allowed id specific for user
    Idea.find({user:req.user.id})
     .sort({date:'desc'})
     .then(ideas=>{
         res.render('ideas/index',{ideas:ideas})
     })
   // res.render('ideas/index')
})

//Add Idea Form
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add')
    
})

//Edit Idea Form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
Idea.findOne({
    _id:req.params.id
}).then(idea=>{
    if(idea.user!=req.user.id)
    {
        req.flash('error_msg','Not Authorized');
        res.redirect('/ideas');
    }
   else{
    res.render('ideas/edit',{
        idea:idea
    })
   }
})
    
    
})

// process form 
router.post('/',ensureAuthenticated,(req,res)=>{
    let errors=[]

    if(!req.body.title){
        errors.push({text:'please add some title'});
    }
    if(!req.body.details){
        errors.push({text:'please add some details'});
    }
    
    if(errors.length>0)
    {
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        });
    }
    else{
        const newUser={
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
            
        }
        new Idea(newUser)
            .save()
            .then(idea=>{
            req.flash('success_msg','video idea Added')
            res.redirect('/ideas')
        });

    }
    
})

//Edit Form process
router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        idea.title=req.body.title;
        idea.details=req.body.details;

        idea.save()
             .then(idea=>{
                 req.flash('success_msg','video idea updates')
                 res.redirect('/ideas');
             })
    })
 
})
//Delete Idea
router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.deleteOne({_id:req.params.id})
        .then(()=>{
            req.flash('success_msg','video idea removed')
            res.redirect('/ideas');
        })
})
//to export form other files
module.exports= router;

