import Joi from 'joi';

const validIndianStates = ["AP", "MH", "KA", "TN", "DL", "GJ", "RJ", "WB"];

const addressSchema = Joi.object({
    street: Joi.string().required().messages({
        'string.empty': 'Street name is required',
    }),
    city: Joi.string().required().messages({
        'string.empty': 'City name is required',
    }),
    postalCode: Joi.string().pattern(/^\\d{6}$/).required().messages({
        'string.pattern.base': 'Postal code must be a 6-digit number',
    }),
    country: Joi.string().required().messages({
        'string.empty': 'Country is required',
    }),
    state: Joi.alternatives().conditional('country', {
        is: 'India',
        then: Joi.string().valid(...validIndianStates).required().messages({
            'any.only': 'State must be a valid Indian state code if country is India',
        }),
        otherwise: Joi.allow(null),
    }),
});

const userProfileSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
    }),
    addresses: Joi.array().items(addressSchema),
});

const validUserProfile = {
    name: "John Doe",
    addresses: [
        {
            street: "123 Main St",
            city: "Mumbai",
            postalCode: "400001",
            country: "India",
            state: "MH",
        },
        {
            street: "456 Elm St",
            city: "Bangalore",
            postalCode: "560001",
            country: "India",
            state: "KA",
        },
        {
            street: "789 Oak St",
            city: "London",
            postalCode: "E1 6AN",
            country: "UK",
            state: null,
        },
    ],
};

const { error } = userProfileSchema.validate(validUserProfile, { abortEarly: false });

if (error) {
    console.log("Joi validation failed:", error.details);
} else {
    console.log("Joi validation passed");
}
