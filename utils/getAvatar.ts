export function getAvatarUrl(item: any): string {
    if (item?.photo) {
        return `data:image/jpeg;base64,${item.photo}`;
    }
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const colorIndex = (item.name?.charCodeAt(0) || 0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Unknown')}&background=${colors[colorIndex].substring(1)}&color=fff&size=40`;
}
