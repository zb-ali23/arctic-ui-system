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
  business_phone: "+968 9123 4567",
  business_email: "info@cooltech.om",
  business_address: {
    street: "Way 2345, Building 123",
    city: "Muscat",
    state: "Muscat Governorate",
    zip: "112",
  },
  whatsapp_number: "96891234567",
  business_hours: {
    weekdays: "8AM - 8PM",
    saturday: "8AM - 8PM",
    sunday: "Closed (Friday)",
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
