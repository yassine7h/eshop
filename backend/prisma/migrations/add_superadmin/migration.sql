-- CreateSupadmin IfNotExists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM "User" u 
        WHERE 'SUPADMIN' = ANY(u.roles)
    ) THEN
        INSERT INTO "User" (
            "email",
            "firstname",
            "lastname",
            "createdAt",
            "updatedAt",
            "password",
            "isActive",
            "roles"
        ) VALUES (
            'supadmin@eshop.com',
            'supadmin',
            'supadmin',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            '$argon2id$v=19$m=65536,t=3,p=4$Eiv3bcgE4y54v+GLFdivUg$e4qgCRDZd1NxZJYdjeZL5zlfc7Kng7wTqOnby5YNrnk',
            TRUE,
            ARRAY['SUPADMIN']::"Role"[]
        );
    END IF;
END $$;