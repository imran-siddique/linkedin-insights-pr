import Joi from 'joi'

export const analyzeProfileSchema = Joi.object({
  linkedinUrl: Joi.string()
    .required()
    .pattern(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-\.]+\/?$|^[a-zA-Z0-9\-\.]+$/)
    .message('Please provide a valid LinkedIn profile URL or username')
})

export const skillInsightsSchema = Joi.object({
  skills: Joi.array()
    .items(Joi.string().min(1).max(50))
    .min(1)
    .max(20)
    .required(),
  experience: Joi.number()
    .integer()
    .min(0)
    .max(50)
    .required(),
  industry: Joi.string()
    .min(2)
    .max(100)
    .required()
})

export const trendingTopicsSchema = Joi.object({
  profileData: Joi.object({
    name: Joi.string().required(),
    headline: Joi.string().required(),
    followers: Joi.number().integer().min(0).required(),
    connections: Joi.number().integer().min(0).required(),
    posts: Joi.number().integer().min(0).required(),
    engagement: Joi.number().min(0).max(100).required(),
    profileScore: Joi.number().min(0).max(100).required(),
    industry: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).required(),
    experience: Joi.number().integer().min(0).required(),
    location: Joi.string().optional(),
    summary: Joi.string().optional()
  }).required()
})

export const recommendationsSchema = Joi.object({
  profileData: Joi.object({
    name: Joi.string().required(),
    headline: Joi.string().required(),
    followers: Joi.number().integer().min(0).required(),
    connections: Joi.number().integer().min(0).required(),
    posts: Joi.number().integer().min(0).required(),
    engagement: Joi.number().min(0).max(100).required(),
    profileScore: Joi.number().min(0).max(100).required(),
    industry: Joi.string().required(),
    skills: Joi.array().items(Joi.string()).required(),
    experience: Joi.number().integer().min(0).required(),
    location: Joi.string().optional(),
    summary: Joi.string().optional()
  }).required()
})