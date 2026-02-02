/**
 * �齱ϵͳ�����ļ�
 * ������������Ϣ�ͽ�Ʒ��Ϣ
 */

// ���������� - �����������н�Ȩ��
// Ȩ��Խ�ߣ��н�����Խ����Ը��ʣ�
const PARTICIPANTS_CONFIG = [
    { name: "����", weight: 1 },
    { name: "����", weight: 1.5 },
    { name: "����", weight: 1 },
    { name: "����", weight: 2 },
    { name: "Ǯ��", weight: 1 },
    { name: "���", weight: 1.2 },
    { name: "�ܾ�", weight: 1 },
    { name: "��ʮ", weight: 1.8 },
    { name: "֣ʮһ", weight: 1 },
    { name: "��ʮ��", weight: 1.3 },
    { name: "��ʮ��", weight: 1 },
    { name: "��ʮ��", weight: 1.5 },
    { name: "��ʮ��", weight: 1 },
    { name: "��ʮ��", weight: 1.1 },
    { name: "��ʮ��", weight: 1 },
    { name: "��ʮ��", weight: 1.4 },
    { name: "��ʮ��", weight: 1 },
    { name: "���ʮ", weight: 1.6 },
    { name: "��إһ", weight: 1 },
    { name: "��إ��", weight: 1.2 },
    { name: "��إ��", weight: 1 },
    { name: "��إ��", weight: 1.3 },
    { name: "��إ��", weight: 1 },
    { name: "��إ��", weight: 1.7 },
    { name: "ʩإ��", weight: 1 },
    { name: "��إ��", weight: 1.1 },
    { name: "��إ��", weight: 1 },
    { name: "����ʮ", weight: 1.5 },
];

// ��Ʒ���� - �����ȼ���������ͼƬ·��������
const PRIZES_CONFIG = [
    {
        level: 1,
        name: "�صȽ�",
        displayName: "iPhone 16 Pro Max",
        quantity: 1,
        image: "images/prize1.png",
        description: "ƻ�������콢�ֻ�",
        color: "#FFD700" // ��ɫ
    },
    {
        level: 2,
        name: "һ�Ƚ�",
        displayName: "iPad Pro 2024",
        quantity: 2,
        image: "images/prize2.png",
        description: "������ƽ�����",
        color: "#C0C0C0" // ��ɫ
    },
    {
        level: 3,
        name: "���Ƚ�",
        displayName: "AirPods Pro",
        quantity: 3,
        image: "images/prize3.png",
        description: "�����������߶���",
        color: "#CD7F32" // ͭɫ
    },
    {
        level: 4,
        name: "���Ƚ�",
        displayName: "С���ֻ�8",
        quantity: 5,
        image: "images/prize4.png",
        description: "�����˶��ֻ�",
        color: "#E8E8E8"
    },
    {
        level: 5,
        name: "���뽱",
        displayName: "����U��",
        quantity: 10,
        image: "images/prize5.png",
        description: "64GB����U��",
        color: "#87CEEB"
    }
];

// ϵͳ����
const SYSTEM_CONFIG = {
    // �齱��������ʱ�䣨���룩
    animationDuration: 3000,
    // �Ƿ���ʾȨ����Ϣ
    showWeight: false,
    // ��˾/�����
    eventName: "2026��ȳ齱ʢ��",
    // ����ɫ
    primaryColor: "#667eea",
    secondaryColor: "#764ba2"
};

// �������ã�����ģ�黯��ȫ�����ã�
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PARTICIPANTS_CONFIG, PRIZES_CONFIG, SYSTEM_CONFIG };
}
