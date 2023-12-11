using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BeautyPoly.Common
{
    public static class Config
    {
        /// <summary>
        /// Môi trường chạy
        /// 1: Môi trường Publish lên server
        /// 0: Môi trường Test trên local
        /// </summary>
        /// 
        public static int _environment = 0;

        //public static string _folderName = @"D:\TemplateExcel";
        //public static string _fileNameDailyReport = "DS_DailyReport.xlsx";                                                                                                                                                                                                                                                                                        

        //public static string _path = @"\\192.168.1.2\ftp\Upload\BillVehicle";
         
        public static string Connection()
        {                                                                                                                                                                                                                                       
            string conn = "";
            if (_environment == 0)
            {
                conn = @"Data Source=DESKTOP-ABEN704\SQLEXPRESS;Initial Catalog=DATN;User ID=sa;Password=1";
            }
            else
            {
                conn = @"";
            }

            return conn;
        }

    }
}

