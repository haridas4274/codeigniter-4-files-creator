export function capitalize(value: string): string {
    if (!value) {return '';}
    return value.charAt(0).toUpperCase() + value.slice(1);
}
module.exports.lowercase = function(string:string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
};