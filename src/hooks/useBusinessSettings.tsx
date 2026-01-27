import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BusinessSettings {
  business_phone: string;
  business_email: string;
  business_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  whatsapp_number: string;
  business_hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

const defaultSettings: BusinessSettings = {
  business_phone: "(555) 123-4567",
  business_email: "info@acrepair.com",
  business_address: {
    street: "123 Main St",
    city: "Houston",
    state: "TX",
    zip: "77001",
  },
  whatsapp_number: "15551234567",
  business_hours: {
    weekdays: "8AM - 6PM",
    saturday: "9AM - 4PM",
    sunday: "Closed",
  },
};

export function useBusinessSettings() {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("key, value")
        .in("key", [
          "business_phone",
          "business_email",
          "business_address",
          "whatsapp_number",
          "business_hours",
        ]);

      if (error) throw error;

      if (data && data.length > 0) {
        const newSettings = { ...defaultSettings };
        data.forEach((item) => {
          const key = item.key as keyof BusinessSettings;
          newSettings[key] = item.value as any;
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Error fetching business settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refetch: fetchSettings };
}

export async function updateBusinessSetting(key: string, value: any) {
  const { error } = await supabase
    .from("system_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key);

  if (error) throw error;
}
