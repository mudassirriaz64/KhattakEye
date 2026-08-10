const axios = require('axios');

/**
 * Send WhatsApp notification to admin for High Index / Price-On-Request orders.
 * Supports:
 * 1. Meta WhatsApp Business Cloud API (graph.facebook.com)
 * 2. Generic Webhook / Gateway / Twilio fallback
 * 3. Terminal & Server Log fallback with click-to-chat WhatsApp link
 */
const sendWhatsAppPriceOnRequestNotification = async (order) => {
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || '923001234567';
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;

  // Build item breakdown text
  const highIndexItems = order.items.filter((item) => item.customization?.priceOnRequest);
  const itemsText = highIndexItems
    .map((item) => `• ${item.name} (${item.customization.lensOptionTypeSlug || 'High Index'})`)
    .join('\n');

  // Customer contact details
  const customerName = order.customerName || 'Customer';
  const customerPhone = order.customerPhone || 'N/A';
  const customerEmail = order.customerEmail || 'N/A';
  const orderNum = order.orderNumber || order._id;

  // Direct click-to-chat link formatted for opening WhatsApp conversation with customer
  const cleanCustomerPhone = customerPhone.replace(/[^0-9]/g, '');
  const customerChatLink = cleanCustomerPhone ? `https://wa.me/${cleanCustomerPhone}` : 'N/A';

  const messageText = 
`🚨 *NEW HIGH-INDEX PRICE QUOTE REQUIRED*
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Order Number:* ${orderNum}
*Customer Name:* ${customerName}
*Customer Phone:* ${customerPhone}
*Customer Email:* ${customerEmail}

*High-Index Lens Request:*
${itemsText}

💬 *Click to Chat with Customer:*
${customerChatLink}

━━━━━━━━━━━━━━━━━━━━━━━━━━
_Log into Admin Panel to set the final quote price._`;

  console.log('\n' + '='.repeat(60));
  console.log('📱 WHATSAPP HIGH-INDEX NOTIFICATION GENERATED');
  console.log('='.repeat(60));
  console.log(messageText);
  console.log('='.repeat(60) + '\n');

  // 1. Meta WhatsApp Business Cloud API Integration
  if (phoneNumberId && apiToken) {
    try {
      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: adminPhone.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { preview_url: true, body: messageText }
        },
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ Meta WhatsApp Business Cloud API message dispatched to +${adminPhone}`);
      return true;
    } catch (err) {
      console.error('⚠️  Meta WhatsApp API Dispatch Error:', err.response?.data || err.message);
    }
  }

  // 2. Custom Webhook / WhatsApp Gateway Integration
  if (gatewayUrl) {
    try {
      await axios.post(gatewayUrl, {
        to: adminPhone,
        message: messageText,
        orderId: order._id,
        orderNumber: orderNum,
        customerPhone
      });
      console.log(`✅ Custom WhatsApp Gateway message dispatched to ${gatewayUrl}`);
      return true;
    } catch (err) {
      console.error('⚠️  Custom WhatsApp Gateway Error:', err.message);
    }
  }

  return false;
};

module.exports = {
  sendWhatsAppPriceOnRequestNotification
};
