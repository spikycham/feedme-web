export default class Permission {
    static IsCustomer(role: UserRole) {
        return role === 0;
    }
    static IsMerchant(role: UserRole) {
        return role === 1;
    }
}
