const Jimp = require('jimp');
const path = require('path');
const allowedExtensions = ['.png','.jpg','.jpeg','.gif'];
const Organisation = require('../models/Organisation');
const { body, validationResult } = require('express-validator');
const slugify = require('slugify')


exports.uploadImage = (req,res)=>{
    //validating request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.file){
        let fileExtension = path.extname(req.file.filename.toLowerCase());
        if (!allowedExtensions.includes(fileExtension))
            return res.status(400).json({error:true,message:"Bad format file"});
        let image = {
            cropped:process.env.FILE_BASE_URL+'cropped-' + req.file.filename,
            original:process.env.FILE_BASE_URL + req.file.filename,
        };
        //crop image
        Jimp.read(image.original, (err, img) => {
            if (err){
                return res.json({
                    message: "Oops! un problème avec l'image de couverture : format incompatible",
                    error: true
                })
            }else{
                img
                    .contain(200, 200) // contain
                    .quality(90) // set JPEG quality
                    //  .greyscale() // set greyscale
                    .write(image.cropped); // save
            }
        });
        image.cropped = process.env.FRONT_URL+image.cropped;
        image.original = process.env.FRONT_URL+image.original;
        let datas = req.body.type==="logo"?{logo:image}:{cover:image};
        Organisation.update(datas,{
            where: {
                slug: req.body.slug
            }}).then((result)=>{
            return res.status(200).json({error:false,message:"Image uploaded",image:image})
        }).catch(error=>{
            console.log(error)
            return res.status(500).json({success:false,message:"Unknown error"})
        });
    }else{
        return res.status(400).json({error:true,message:"File is required"})
    }

};
exports.createOrganisation = async (req,res)=>{
    //validating request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let slug = slugify(req.body.name.toLowerCase());
        let org = await Organisation.findOne({where:{slug:slug}});
             await Organisation.sync({force:true});
        if (org!==null){
            return res.status(200).json({success:false,message:"Une organisation avec le même nom existe déjà"})
        }else{
            let datas = req.body;
            datas.slug = slug;
           let result =  await Organisation.create(datas);
            return res.status(200).json({success:true,message:"Organisation créée avec succès",organisation:result})
        }

    }catch (e) {
        console.log('error')
        console.log(e);
        return res.status(500).json({success:false,message:"Unknown error"})

    }

};
exports.getOrganisations = async (req,res)=>{
    let organisations = await Organisation.findAll({where:{is_active:true}});
    return res.status(200).json({success:true,organisations:organisations});
};
exports.getOneOrganisation = async (req,res)=>{
    let organisation = await Organisation.findOne();
    return res.status(200).json({success:true,organisation:organisation});
};
exports.updateOrganisation = async (req,res)=>{
    //validating request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let newSlug = slugify(req.body.name.toLowerCase());
        let org = await Organisation.findOne({where:{slug:newSlug}});
             await Organisation.sync({force:true});
        if (org!==null && newSlug!==req.body.slug){
            return res.status(200).json({success:false,message:"Une organisation avec le même nom existe déjà"})
        }else{
            let datas = req.body;
            datas.slug = newSlug;
            let result =  await Organisation.update({where:{slug:req.body.slug}},datas);
            return res.status(200).json({success:true,message:"Organisation mise à jour avec succès",organisation:result});
        }
    }catch (e) {
        console.log('error');
        console.log(e);
        return res.status(500).json({success:false,message:"Unknown error"});
    }

};
exports.deleteOrganisation = async (req,res)=>{
        Organisation.destroy({where:{slug:req.params.slug}}).then(()=>{
            return res.status(200).json({success:true,message:"Organisation supprimé avec succès"});
        }).catch((error)=>{
            console.log(error)
            return res.status(500).json({success:false,message:"Erreur du serveur"})
        })
};
exports.activateOrDeactivateOrg = async (req,res)=>{
    let organisation = await Organisation.findOne({where:{slug:req.params.slug}});
    let newStatus = !organisation.is_active;
    let datas = {is_active:newStatus};
    Organisation.update({where:{slug:req.body.slug}},datas).then(()=>{
        return res.status(200).json({success:true,message:"Organisation supprimé avec succès"});
    }).catch((error)=>{
        return res.status(500).json({success:false,message:"Unknown error"});
    });
};


