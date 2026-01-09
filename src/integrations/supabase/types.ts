export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      booking_status_history: {
        Row: {
          booking_id: string
          changed_by: string | null
          created_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Insert: {
          booking_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["booking_status"]
        }
        Update: {
          booking_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
        }
        Relationships: [
          {
            foreignKeyName: "booking_status_history_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          address_id: string
          admin_notes: string | null
          assigned_at: string | null
          booking_number: string
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          confirmed_at: string | null
          created_at: string
          customer_id: string
          customer_notes: string | null
          discount_amount: number | null
          estimated_price: number | null
          final_price: number | null
          id: string
          is_flexible: boolean | null
          priority: Database["public"]["Enums"]["service_priority"]
          problem_description: string | null
          rating: number | null
          review: string | null
          reviewed_at: string | null
          scheduled_date: string
          selected_issues: string[] | null
          service_id: string
          source: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["booking_status"]
          technician_id: string | null
          technician_notes: string | null
          time_slot_id: string | null
          time_slot_label: string | null
          updated_at: string
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          address_id: string
          admin_notes?: string | null
          assigned_at?: string | null
          booking_number: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          discount_amount?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          is_flexible?: boolean | null
          priority?: Database["public"]["Enums"]["service_priority"]
          problem_description?: string | null
          rating?: number | null
          review?: string | null
          reviewed_at?: string | null
          scheduled_date: string
          selected_issues?: string[] | null
          service_id: string
          source?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technician_id?: string | null
          technician_notes?: string | null
          time_slot_id?: string | null
          time_slot_label?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          address_id?: string
          admin_notes?: string | null
          assigned_at?: string | null
          booking_number?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          confirmed_at?: string | null
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          discount_amount?: number | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          is_flexible?: boolean | null
          priority?: Database["public"]["Enums"]["service_priority"]
          problem_description?: string | null
          rating?: number | null
          review?: string | null
          reviewed_at?: string | null
          scheduled_date?: string
          selected_issues?: string[] | null
          service_id?: string
          source?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          technician_id?: string | null
          technician_notes?: string | null
          time_slot_id?: string | null
          time_slot_label?: string | null
          updated_at?: string
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          apartment: string | null
          city: string
          country: string | null
          created_at: string
          customer_id: string
          id: string
          is_default: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          special_instructions: string | null
          state: string
          street: string
          updated_at: string
          zip: string
        }
        Insert: {
          apartment?: string | null
          city: string
          country?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          special_instructions?: string | null
          state: string
          street: string
          updated_at?: string
          zip: string
        }
        Update: {
          apartment?: string | null
          city?: string
          country?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          special_instructions?: string | null
          state?: string
          street?: string
          updated_at?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean | null
          first_name: string
          id: string
          last_name: string
          loyalty_points: number | null
          notes: string | null
          phone: string
          phone_verified: boolean | null
          source: string | null
          tags: string[] | null
          total_bookings: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean | null
          first_name: string
          id?: string
          last_name: string
          loyalty_points?: number | null
          notes?: string | null
          phone: string
          phone_verified?: boolean | null
          source?: string | null
          tags?: string[] | null
          total_bookings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean | null
          first_name?: string
          id?: string
          last_name?: string
          loyalty_points?: number | null
          notes?: string | null
          phone?: string
          phone_verified?: boolean | null
          source?: string | null
          tags?: string[] | null
          total_bookings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount_paid: number | null
          booking_id: string
          created_at: string
          customer_id: string
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string | null
          line_items: Json | null
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          tax_amount: number | null
          terms: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          booking_id: string
          created_at?: string
          customer_id: string
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal: number
          tax_amount?: number | null
          terms?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          booking_id?: string
          created_at?: string
          customer_id?: string
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string | null
          line_items?: Json | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          subtotal?: number
          tax_amount?: number | null
          terms?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          content: string
          created_at: string
          customer_id: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          sent_at: string | null
          status: string | null
          subject: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          channel: Database["public"]["Enums"]["notification_channel"]
          content: string
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          content?: string
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          customer_id: string
          id: string
          invoice_id: string
          metadata: Json | null
          notes: string | null
          payment_method: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          customer_id: string
          id?: string
          invoice_id: string
          metadata?: Json | null
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          invoice_id?: string
          metadata?: Json | null
          notes?: string | null
          payment_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_id?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          admin_responded_at: string | null
          admin_response: string | null
          booking_id: string
          content: string | null
          created_at: string
          customer_id: string
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          is_verified: boolean | null
          professionalism: number | null
          punctuality: number | null
          rating: number
          service_quality: number | null
          technician_id: string | null
          title: string | null
          updated_at: string
          value_for_money: number | null
        }
        Insert: {
          admin_responded_at?: string | null
          admin_response?: string | null
          booking_id: string
          content?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          is_verified?: boolean | null
          professionalism?: number | null
          punctuality?: number | null
          rating: number
          service_quality?: number | null
          technician_id?: string | null
          title?: string | null
          updated_at?: string
          value_for_money?: number | null
        }
        Update: {
          admin_responded_at?: string | null
          admin_response?: string | null
          booking_id?: string
          content?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          is_verified?: boolean | null
          professionalism?: number | null
          punctuality?: number | null
          rating?: number
          service_quality?: number | null
          technician_id?: string | null
          title?: string | null
          updated_at?: string
          value_for_money?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number | null
          estimated_duration_minutes: number | null
          features: Json | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_emergency: boolean | null
          is_popular: boolean | null
          name: string
          price_type: string | null
          short_description: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          estimated_duration_minutes?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_emergency?: boolean | null
          is_popular?: boolean | null
          name: string
          price_type?: string | null
          short_description?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          estimated_duration_minutes?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_emergency?: boolean | null
          is_popular?: boolean | null
          name?: string
          price_type?: string | null
          short_description?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      technician_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          technician_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          technician_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_availability_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_locations: {
        Row: {
          accuracy: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          technician_id: string
        }
        Insert: {
          accuracy?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          technician_id: string
        }
        Update: {
          accuracy?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_locations_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          certifications: string[] | null
          completed_jobs: number | null
          created_at: string
          employee_id: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          notes: string | null
          rating: number | null
          specializations:
            | Database["public"]["Enums"]["service_category"][]
            | null
          total_jobs: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          certifications?: string[] | null
          completed_jobs?: number | null
          created_at?: string
          employee_id?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          notes?: string | null
          rating?: number | null
          specializations?:
            | Database["public"]["Enums"]["service_category"][]
            | null
          total_jobs?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          certifications?: string[] | null
          completed_jobs?: number | null
          created_at?: string
          employee_id?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          notes?: string | null
          rating?: number | null
          specializations?:
            | Database["public"]["Enums"]["service_category"][]
            | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          content: string
          created_at: string
          customer_avatar: string | null
          customer_name: string
          customer_title: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          rating: number | null
          service_type: string | null
        }
        Insert: {
          content: string
          created_at?: string
          customer_avatar?: string | null
          customer_name: string
          customer_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          service_type?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          customer_avatar?: string | null
          customer_name?: string
          customer_title?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          service_type?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          display_order: number | null
          end_time: string
          id: string
          is_active: boolean | null
          label: string
          period: string | null
          start_time: string
        }
        Insert: {
          display_order?: number | null
          end_time: string
          id?: string
          is_active?: boolean | null
          label: string
          period?: string | null
          start_time: string
        }
        Update: {
          display_order?: number | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          label?: string
          period?: string | null
          start_time?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_booking_number: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      get_technician_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_technician: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "manager" | "technician" | "customer"
      booking_status:
        | "pending"
        | "confirmed"
        | "assigned"
        | "en_route"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rescheduled"
      notification_channel: "email" | "sms" | "push" | "whatsapp"
      notification_type:
        | "booking_confirmed"
        | "booking_reminder"
        | "technician_assigned"
        | "technician_en_route"
        | "service_completed"
        | "payment_received"
        | "booking_cancelled"
      payment_status: "pending" | "paid" | "partial" | "refunded" | "failed"
      service_category: "ac" | "refrigerator" | "hvac" | "commercial"
      service_priority: "normal" | "urgent" | "emergency"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "manager", "technician", "customer"],
      booking_status: [
        "pending",
        "confirmed",
        "assigned",
        "en_route",
        "in_progress",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      notification_channel: ["email", "sms", "push", "whatsapp"],
      notification_type: [
        "booking_confirmed",
        "booking_reminder",
        "technician_assigned",
        "technician_en_route",
        "service_completed",
        "payment_received",
        "booking_cancelled",
      ],
      payment_status: ["pending", "paid", "partial", "refunded", "failed"],
      service_category: ["ac", "refrigerator", "hvac", "commercial"],
      service_priority: ["normal", "urgent", "emergency"],
    },
  },
} as const
