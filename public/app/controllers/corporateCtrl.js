angular.module('corporateController', [])
  .controller('corporateCtrl', function(User) {

    var app = this;
    app.majors = [
      "Aerospace Engineering",
      "Agricultural & Biological Engineering",
      "Biomedical Engineering",
      "Chemical Engineering",
      "Civil Engineering",
      "Computer Engineering",
      "Coastal & Oceanographic Engineering",
      "Computer Science",
      "Digital Arts & Sciences",
      "Electrical Engineering",
      "Environmental Engineering Sciences",
      "Human-Centered Computing",
      "Industrial & Systems Engineering",
      "Materials Science & Engineering",
      "Mechanical Engineering",
      "Nuclear Engineering",
      "Other"
    ];
    app.industries = [
      "Accounting",
      "Airlines/Aviation",
      "Alternative Dispute Resolution",
      "Alternative Medicine",
      "Animation",
      "Apparel/Fashion",
      "Architecture/Planning",
      "Arts/Crafts",
      "Automotive",
      "Aviation/Aerospace",
      "Banking",
      "Biotechnology/Greentech",
      "Broadcast Media",
      "Building Materials",
      "Business Supplies/Equipment",
      "Capital Markets/Hedge Fund/Private Equity",
      "Chemicals",
      "Civic/Social Organization",
      "Civil Engineering",
      "Commercial Real Estate",
      "Computer Engineering",
      "Software Development/Engineering",
      "Construction",
      "Consumer Electronics",
      "Consumer Goods",
      "Consumer Services",
      "Cosmetics",
      "Dairy",
      "Defense/Space",
      "Design",
      "E-Learning",
      "Education Management",
      "Electrical/Electronic Manufacturing",
      "Entertainment/Movie Production",
      "Environmental Services",
      "Events Services",
      "Executive Office",
      "Facilities Services",
      "Farming",
      "Financial Services",
      "Fine Art",
      "Fishery",
      "Food Production",
      "Food/Beverages",
      "Fundraising",
      "Furniture",
      "Gambling/Casinos",
      "Glass/Ceramics/Concrete",
      "Government Administration",
      "Government Relations",
      "Graphic Design/Web Design",
      "Health/Fitness",
      "Higher Education/Acadamia",
      "Hospital/Health Care",
      "Hospitality",
      "Human Resources",
      "Import/Export",
      "Individual/Family Services",
      "Industrial Automation",
      "Information Services",
      "Information Technology",
      "Insurance",
      "International Affairs",
      "International Trade/Development",
      "Internet",
      "Investment Banking/Venture",
      "Investment Management/Hedge Fund/Private Equity",
      "Judiciary",
      "Law Enforcement",
      "Law Practice/Law Firms",
      "Legal Services",
      "Legislative Office",
      "Leisure/Travel",
      "Library",
      "Logistics/Procurement",
      "Luxury Goods/Jewelry",
      "Machinery",
      "Management Consulting",
      "Maritime",
      "Market Research",
      "Marketing/Advertising/Sales",
      "Mechanical or Industrial Engineering",
      "Media Production",
      "Medical Equipment",
      "Medical Practice",
      "Mental Health Care",
      "Military Industry",
      "Mining/Metals",
      "Motion Pictures/Film",
      "Museums/Institutions",
      "Music",
      "Nanotechnology",
      "Newspapers/Journalism",
      "Non-Profit/Volunteering",
      "Oil/Energy",
      "Online Publishing",
      "Other Industry",
      "Outsourcing/Offshoring",
      "Package/Freight Delivery",
      "Packaging/Containers",
      "Paper/Forest Products",
      "Performing Arts",
      "Pharmaceuticals",
      "Philanthropy",
      "Photography",
      "Plastics",
      "Political Organization",
      "Primary/Secondary Education",
      "Printing",
      "Professional Training",
      "Program Development",
      "Public Relations",
      "Public Safety",
      "Publishing Industry",
      "Railroad Manufacture",
      "Ranching",
      "Real Estate/Mortgage",
      "Recreational Facilities/Services",
      "Religious Institutions",
      "Renewables/Environment",
      "Research Industry",
      "Restaurants",
      "Retail Industry",
      "Security/Investigations",
      "Semiconductors",
      "Shipbuilding",
      "Sporting Goods",
      "Sports",
      "Staffing/Recruiting",
      "Supermarkets",
      "Telecommunications",
      "Textiles",
      "Think Tanks",
      "Tobacco",
      "Translation/Localization",
      "Transportation",
      "Utilities",
      "Venture Capital",
      "Veterinary",
      "Warehousing",
      "Wholesale",
      "Wine/Spirits",
      "Wireless",
      "Writing/Editing"
    ];

    this.openMoreInfoModal = function(companyId) {
      $("#moreInfoModal").modal({
        backdrop: 'static'
      });

      User.getCompanyInfo(companyId).then(function(data) {
        app.company = data.data.message;
        app.company.majorsList = "";
        app.company.industryList = "";

        for (var i = 0; i < app.company.majors.length; i++) {
          if (i === app.company.majors.length - 1) {
            app.company.majorsList += app.company.majors[i];
          } else {
            app.company.majorsList += (app.company.majors[i] + ", ");
          }
        }

        for (var i = 0; i < app.company.industry.length; i++) {
          if (i === app.company.industry.length - 1) {
            app.company.industryList += app.company.industry[i];
          } else {
            app.company.industryList += (app.company.industry[i] + ", ");
          }
        }
      });
    };

    this.closeMoreInfoModal = function() {
      $('#moreInfoModal').modal('hide');
    };

    User.getCompanies().then(function(data) {
      if (data.data.success) {
        app.companies = data.data.message;
        console.log(app.companies);
      }
    });
  });
