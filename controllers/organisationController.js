const Jimp = require('jimp');
const path = require('path');
const allowedExtensions = ['.png','.jpg','.jpeg','.gif'];
const Organisation = require('../models/Organisation');
const FunctionOrganisation = require('../models/FunctionOrganisation');
const { body, validationResult } = require('express-validator');
const slugify = require('slugify')
const { Op } = require("sequelize");


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
        //remove {force:true} to avoid dropping table each time
        await Organisation.sync({force:true});
        let slug = slugify(req.body.name.toLowerCase());
        let org = await Organisation.findOne({
            where:{
               //[Op.like]:slug,
               [Op.or]:[{email:req.body.email},req.body.email_secondary?{email:req.body.email_secondary}:{},req.body.email_secondary?{email_secondary:req.body.email_secondary}:{},{email_secondary:req.body.email}]
            },
        });
        if (org!==null){
            return res.status(200).json({success:false,message:"Une organisation avec le même nom ou email existe déjà"})
        }else{
            let datas = req.body;
            datas.slug = slug;
            datas.user_id = 1;//req.session.user.id;
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
    let organisations = req.query.is_active?
        await Organisation.findAll({where:{is_active:req.query.is_active=="true"}}):await Organisation.findAll();
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
        let org = await Organisation.findOne({where:{id:req.params.id}});
        let datas = {...req.body};
        //cheking name unicity
        if (org.name !== req.body.name){
            let newSlug = slugify(req.body.name.toLowerCase());
             let eventual_org = await Organisation.findOne({where:{slug:newSlug}});
                if (eventual_org!==null)
                    return res.status(200).json({success:false,message:"Une organisation avec le même nom existe déjà"})
            else
                datas.slug = newSlug;
        }
        console.log(datas,req.params.id)
            let result =  await Organisation.update(datas,{where:{id:req.params.id}});
            return res.status(200).json({success:true,message:"Organisation mise à jour avec succès",organisation:result});

    }catch (e) {
        console.log('error');
        console.log(e);
        return res.status(500).json({success:false,message:"Unknown error"});
    }

};
exports.deleteOrganisation = async (req,res)=>{
        Organisation.destroy({where:{id:req.params.id}}).then(()=>{
            return res.status(200).json({success:true,message:"Organisation supprimé avec succès"});
        }).catch((error)=>{
            console.log(error)
            return res.status(500).json({success:false,message:"Erreur du serveur"})
        })
};
exports.activateOrDeactivateOrg = async (req,res)=>{
    let organisation = await Organisation.findOne({where:{id:req.params.id}});
    if (organisation === null)
        return res.status(400).json({success:false,message:"organisation non trouvée"})

    let newStatus = !organisation.is_active;
    let datas = {is_active:newStatus};
    let msg = newStatus?"Organisation activée avec succès":"Organisation desactivée avec succès";
    Organisation.update(datas,{where:{id:req.params.id}}).then(()=>{
        return res.status(200).json({success:true,message:msg});
    }).catch((error)=>{
        return res.status(500).json({success:false,message:"Unknown error"});
    });
};
exports.assignFuncToUser = async (req,res)=> {
    //validating request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).json({errors: errors.array()});
    }
    try {
        await FunctionOrganisation.sync({force:true});
        //check if the user is already assignned to the function
        let user_function = await FunctionOrganisation.findOne({
            where:
                {
                    organisation_id: req.body.organisation_id,
                    user_id: req.body.user_id,
                    function_id: req.body.function_id,
                }
        });
        if (user_function !== null) {
            return res.status(200).json({success: false, message: "Cet utilisateur est déjà assigné"})
        } else {
            user_function = await FunctionOrganisation.findOne({
                where:
                    {
                        organisation_id: req.body.organisation_id,
                        user_id: req.body.user_id,
                    }
            });
            let result,msg;
            if (user_function===null){
                 result = await FunctionOrganisation.create(req.body);
                 msg = "Function assignée avec succès";
            }else{
                 result = await FunctionOrganisation.update(req.body,{
                    where:
                        {
                            organisation_id: req.body.organisation_id,
                            user_id: req.body.user_id,
                        }
                });
                msg = "Function mis à jour avec succès";
            }
            return res.status(200).json({
                success: true,
                message: msg,
                organisation: result
            })
        }
    } catch (e) {
        console.log('error');
        console.log(e);
        return res.status(500).json({success: false, message: "Unknown error"})
    }
}

