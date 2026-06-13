Etqan Platform V9 Product Cleanup

What changed:
1. Removed the accidental plain services block that was appearing before the loader.
2. Preserved 11 platform services instead of reducing them to 6.
3. Reorganized services into clear groups:
   - Academic services
   - Graduation projects
   - Presentations and design
   - Languages and development
4. Highlighted the 4 most requested services at the top.
5. Updated default services in app.js to match the 11-service structure.
6. Replaced the 5-item mobile bottom nav with 3 key actions:
   - Request
   - Track
   - Account
7. Added service-card click behavior to preselect the requested service in the order form.
8. Added clearer starting prices.
9. Hid the floating WhatsApp button that was visually competing with the bottom navigation.
10. Checked app.js syntax with node --check.

Notes:
- No security/authentication architecture was changed.
- Firebase configuration was not changed.
- Admin/member/order IDs were preserved as much as possible.
