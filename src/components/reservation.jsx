import React, { useEffect, useRef } from "react";

function BookingWidget() {
  const widgetContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "//widget.simplybook.it/v2/widget/widget.js";
    script.onload = () => {
      new SimplybookWidget({
        widget_type: "iframe",
        url: "https://vrcafe66.simplybook.it",
        theme: "concise",
        theme_settings: {
          timeline_hide_unavailable: "1",
          hide_past_days: "0",
          timeline_show_end_time: "0",
          timeline_modern_display: "as_table",
          light_font_color: "#ffffff",
          sb_secondary_base: "#050405",
          sb_base_color: "#bf68b1",
          display_item_mode: "block",
          booking_nav_bg_color: "#ffffff",
          sb_review_image: "68",
          sb_review_image_preview: null,
          dark_font_color: "#1f2937",
          btn_color_1: "#16a3e2",
          sb_company_label_color: "#ffffff",
          hide_img_mode: "1",
          show_sidebar: "1",
          sb_busy: "#c7b3b3",
          sb_available: "#d6ebff",
        },
        timeline: "modern",
        datepicker: "top_calendar",
        is_rtl: false,
        app_config: {
          clear_session: 0,
          allow_switch_to_ada: 0,
          predefined: { provider: "1" },
        },
        container_id: "sbw_36ve1d",
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="sbw_36ve1d" ref={widgetContainerRef}></div>;
}

export default BookingWidget;
