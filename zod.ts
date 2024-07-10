import { z } from 'zod';

const validIndianStates = ["AP", "MH", "KA", "TN", "DL", "GJ", "RJ", "WB"];

const addressSchema = z.object({
    street: z.string().min(1, "Street name is required"),
    city: z.string().min(1, "City name is required"),
    postalCode: z.string().regex(/^\d{6}$/, "Postal code must be a 6-digit number"),
    country: z.string().min(1, "Country is required"),
    state: z.string().nullable().optional(),
}).refine(data => {
    if (data.country === 'India') {
        return data.state && validIndianStates.includes(data.state);
    }
    return data.state === null;
}, {
    message: "State must be a valid Indian state code if country is India, otherwise it must be null",
});

const userProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    addresses: z.array(addressSchema),
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

try {
    userProfileSchema.parse(validUserProfile);
    console.log("Zod validation passed");
} catch (e) {
    console.log("Zod validation failed:", e.errors);
}
