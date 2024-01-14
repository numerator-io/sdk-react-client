export const upperCamelCase = (str: String) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
}

export const lowerCamelCase = (str: String) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toLowerCase()).replace(/\s+/g, '');
}
