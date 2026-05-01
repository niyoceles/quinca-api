export const orderSummaryTemplate = (names, email, phoneNumber, type, items, total, date) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">${item.itemName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; text-align: center;">${item.itemNumber || item.quantity || 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; text-align: right; font-weight: bold;">RWF ${item.itemPrice.toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #ff4400; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">HADIWA</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-weight: 600; font-size: 14px;">New ${type} Confirmation</p>
        </div>
        
        <div style="padding: 32px;">
          <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px; font-weight: 800;">Hello ${names},</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
            Thank you for choosing Hadiwa! We've received your ${type} request and our team is already reviewing it. Below are the details of your selection.
          </p>

          <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
            <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Contact Information</p>
            <div style="display: flex; gap: 24px;">
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 11px; color: #64748b; margin-bottom: 4px;">Email Address</p>
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e293b;">${email}</p>
              </div>
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 11px; color: #64748b; margin-bottom: 4px;">Phone Number</p>
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e293b;">${phoneNumber}</p>
              </div>
            </div>
          </div>
          
          <div style="background-color: #f1f5f9; border-radius: 16px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #e2e8f0;">
                  <th style="padding: 12px; text-align: left; font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Material</th>
                  <th style="padding: 12px; text-align: center; font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                  <th style="padding: 12px; text-align: right; font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 20px 12px; font-weight: 800; color: #1e293b; font-size: 16px; text-align: right;">Total Estimated</td>
                  <td style="padding: 20px 12px; font-weight: 900; color: #ff4400; font-size: 18px; text-align: right;">RWF ${total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #f1f5f9;">
            <div style="display: flex; gap: 20px; margin-bottom: 24px;">
              <div style="flex: 1;">
                <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Request Date</p>
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #1e293b;">${date}</p>
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 0; font-style: italic;">
              Our suppliers will review your request and get back to you within 24 hours. For any urgent inquiries, please contact our support at paradisebountyco@gmail.com
            </p>
          </div>
        </div>
        
        <div style="background-color: #1e293b; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 600;">&copy; ${new Date().getFullYear()} Hadiwa | PARADI-BOUNTY Co. LTD</p>
        </div>
      </div>
    </div>
  `;
};
