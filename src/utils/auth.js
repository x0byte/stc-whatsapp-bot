function isAuthorizedOwner(senderId, ownerNumbers) {
    if (!senderId) {
        return false;
    }

    return ownerNumbers.includes(senderId);
}

module.exports = {
    isAuthorizedOwner
};
