-- Lumière Skin sample catalogue. Run after schema.sql.
-- Safe to rerun: existing product IDs are left unchanged.
insert into public.products
  (id, brand, name, category, price, stock, description, image, source, active)
values
  ('p1','CeraVe','Foaming Facial Cleanser','Cleanser',620,24,'Foaming gel cleanser for normal-to-oily skin, with ceramides, hyaluronic acid and niacinamide.','https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80','https://www.cerave.eg/en/skincare/cleansers/foaming-facial-cleanser',true),
  ('p2','The Ordinary','Niacinamide 10% + Zinc 1%','Serum',780,18,'Water-based serum formulated with niacinamide and zinc PCA for blemish-prone skin.','https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80','https://theordinary.com/en-eg',true),
  ('p3','CeraVe','Moisturising Cream','Moisturizer',690,15,'Rich moisturising cream with three essential ceramides to help support the skin barrier.','https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80','https://www.cerave.eg/en/skincare',true),
  ('p4','La Roche-Posay','Anthelios UVMune 400 SPF50+ Invisible Fluid','Sunscreen',1150,12,'Daily high-protection sunscreen from the Anthelios UVMune 400 range. Follow the pack directions for application and reapplication.','https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80','https://www.laroche-posay.com/',true),
  ('p5','The Ordinary','Hyaluronic Acid 2% + B5','Serum',820,20,'Hydrating serum featuring hyaluronic acid and vitamin B5. Check the current product label for full ingredients.','https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80','https://theordinary.com/en-eg',true),
  ('p6','Bioderma','Sensibio H2O Micellar Water','Cleanser',540,30,'Micellar cleansing water from the Sensibio range, designed for sensitive skin.','https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80','https://www.bioderma.com/',true),
  ('p7','CeraVe','Resurfacing Retinol Serum','Serum',990,9,'A retinol serum with ceramides and niacinamide, marketed for the appearance of post-acne marks. Use only as directed on the label.','https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80','https://www.cerave.eg/en/skincare',true),
  ('p8','La Roche-Posay','Cicaplast Baume B5+','Moisturizer',890,11,'Multi-purpose soothing balm from the Cicaplast range. Check the product packaging for directions and suitability.','https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80','https://www.laroche-posay.com/',true)
on conflict (id) do nothing;
