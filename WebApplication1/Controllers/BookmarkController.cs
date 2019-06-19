using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Web;

using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    public class BookmarkController : Controller
    {
        //return Bookmark list
        [HttpGet("[action]")]
        public String getBookmarks()
        {
            List<Bookmark> bookmarkList = HttpContext.Session.GetObjectFromJson<List<Bookmark>>("Bookmarks");
     
            return JsonConvert.SerializeObject(bookmarkList);
        }
        //sava bookmark to list 
        [HttpPost("[action]")]
        public String bookmarkRepo([FromBody]Bookmark bookmark)
        {
            List<Bookmark> bookmarkList = HttpContext.Session.GetObjectFromJson<List<Bookmark>>("Bookmarks");
            if (bookmarkList == null) bookmarkList = new List<Bookmark>();
            
            
                bookmarkList.Add(bookmark);
                HttpContext.Session.SetObjectAsJson("Bookmarks", bookmarkList);
            
                             
            return bookmark.full_name;
        }

        [Serializable]
        public class Bookmark
        {
            public string full_name { get; set; }
            public string avatar_url { get; set; }
            public string html_url { get; set; }
        }


    }

    public static class SessionExtensions
    {
        public static void SetObjectAsJson(this ISession session, string key, object value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T GetObjectFromJson<T>(this ISession session, string key)
        {
            var value = session.GetString(key);

            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
    }
}
