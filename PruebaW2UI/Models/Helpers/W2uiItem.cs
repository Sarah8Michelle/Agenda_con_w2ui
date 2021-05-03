using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PruebaW2UI.Models.Helpers
{
    public class W2uiItem
    {
        public string Id { get; set; }

        public string Text { get; set; }

        public string Icon { get; set; }

        public string Img { get; set; }

        public bool Disabled { get; set; }

        public bool Hidden { get; set; }

        public int? Count { get; set; }
    }
}
