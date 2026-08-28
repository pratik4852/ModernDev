const lmsService = require("../services/lmsService");

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      video: req.file ? req.file.filename : null,
    };

    const result = await lmsService.createLMS(data);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async(req,res)=>{
    try{
        const data = await lmsService.getAllLMS();
        res.json(data);
        }
    catch(err){
        res.status(500).json({message:err.message});

    }
}

exports.getById = async(req,res)=>{
    try{
    const data = await lmsService.getLMSById(req.params.id);
    res.json(data);

    if(!data){
        return res.status(404).json({message:"Not found"});
    }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.update = async(req,res)=>{
    try{
        const data = await lmsService.updateLMS(req.params.id,req.body);
        res.json(data);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.delete = async(req,res)=>{
    try{
        const data = await lmsService.deleteLMS(req.params.id);
        res.json(data);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.toggle = async(req,res)=>{
    try{
        const data = await lmsService.toggleLMS(req.params.id);
        res.json(data);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
    }
    







