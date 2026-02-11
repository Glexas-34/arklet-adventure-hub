-- Fix admin_gifts RLS policy to include all admin users

DROP POLICY IF EXISTS "Only admins can give gifts" ON public.admin_gifts;

CREATE POLICY "Only admins can give gifts"
ON public.admin_gifts FOR INSERT
WITH CHECK (
  given_by IN ('Adam', 'Admin___James', 'Admin___Levi', 'rt3rockydagoat95')
);
