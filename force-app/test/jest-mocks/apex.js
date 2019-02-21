// Mocking how getSObjectValue retrieves the field value.
export const getSObjectValue = (object, field) => {
    return object[field.fieldApiName];
};
