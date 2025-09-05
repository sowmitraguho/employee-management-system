import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import useProtectedAxios from "../../../../Hooks/useProtectedAxios";
import Loader from "../../../../Components/Loader/Loader";

const HomepageDataPage = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [serviceEditing, setServiceEditing] = useState(false);
  const [pricePlanEditing, setPricePlanEditing] = useState(false);
  const [logoEditing, setLogoEditing] = useState(false);
  const [newLogo, setNewLogo] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [pricingPlansData, setPricingPlansData] = useState([]);

  const fetchHomepageData = async () => {
    try {
      const res = await useProtectedAxios.get(`/content`);
      setHomepageData(res.data);
      setServicesData(res.data.services || []);
      setPricingPlansData(res.data.pricingPlans || []);
    } catch (err) {
      console.error("Error fetching homepage data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleImageUpload = async (imagefile) => {
       // if (!file) return formData.image;

        const form = new FormData();
        form.append("image", imagefile);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbbApiKey}`, {
            method: "POST",
            body: form,
        });
        const data = await res.json();
        console.log(data.data.display_url);
        setNewLogo(data.data.display_url);
        return data.data.display_url;
    };

  const handleChange = (section, field, value) => {
    setHomepageData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // New handler for services array
const handleServiceChange = (index, field, value) => {
  setServicesData((prev) => {
    const updated = [...prev];
    updated[index] = { ...updated[index], [field]: value };
    return updated;
  });
};
const handlePricingPlanChange = (index, field, value) => {
  setPricingPlansData((prev) => {
    const updated = [...prev];
    updated[index] = { ...updated[index], [field]: value };
    return updated;
  });
};


  const handleUpdateInviteSectionData = async () => {
    try {
      await useProtectedAxios.patch(`/content/inviteSection`, { inviteSection: homepageData.inviteSection });
      //console.log('Updated invite section data:', { inviteSection: homepageData.inviteSection });
      alert("Invite section data updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error saving invite section data:", err);
      alert("Failed to update data!");
    }
  };
  const handleUpdateServiceSectionData = async () => {
    try {
      await useProtectedAxios.patch(`/content/services`, { services: servicesData });
      console.log('Updated service section data:', { services: servicesData });
      alert("Service section data updated successfully!");
      setServiceEditing(false);
    } catch (err) {
      console.error("Error saving service section data:", err);
      alert("Failed to update data!");
    }
  };
  const handleUpdatePricingPlan = async () => {
    try {
      await useProtectedAxios.patch(`/content/pricingPlans`, { pricingPlans: pricingPlansData });
      console.log('Updated pricing plan data:', { pricingPlans: pricingPlansData });
      alert("Pricing plan data updated successfully!");
      setPricePlanEditing(false);
    } catch (err) {
      console.error("Error saving pricing plan data:", err);
      alert("Failed to update data!");
    }
  };
  
  const handleAddLogo = async () => {
    try {
      await useProtectedAxios.patch(`/content/logos`, { logos: [...homepageData.logos, newLogo] });
      alert("Homepage logos updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error("Error saving homepage data:", err);
      alert("Failed to update data!");
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  if (loading) return <Loader />;
  if (!homepageData) return <p>No data found.</p>;

  return (
    <div className="space-y-6 py-4">
      
      <h1 className="text-3xl text-center font-bold bg-gradient-to-r from-blue-500 to-teal-500 text-transparent bg-clip-text">
          Homepage Data Management
        </h1>

      {/* Invite Section */}
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b my-2">Invite Section</h2>
        {editing ? (
          <div className="space-y-3">
            <Input
              value={homepageData.inviteSection.heading}
              onChange={(e) =>
                handleChange("inviteSection", "heading", e.target.value)
              }
              placeholder="Heading"
            />
            <Input
              value={homepageData.inviteSection.highlight}
              onChange={(e) =>
                handleChange("inviteSection", "highlight", e.target.value)
              }
              placeholder="Highlight"
            />
            <Textarea
              value={homepageData.inviteSection.paragraph}
              onChange={(e) =>
                handleChange("inviteSection", "paragraph", e.target.value)
              }
              placeholder="Paragraph"
            />
          </div>
        ) : (
          <div>
            <p><strong>Heading:</strong> {homepageData.inviteSection.heading}</p>
            <p><strong>Highlight:</strong> {homepageData.inviteSection.highlight}</p>
            <p><strong>Paragraph:</strong> {homepageData.inviteSection.paragraph}</p>
          </div>
        )}
        <div className="flex gap-3">
        {!editing ? (
          <Button className="bg-blue-500 text-white px-6 mt-4" onClick={() => setEditing(true)}>Edit</Button>
        ) : (
          <>
            <Button className="bg-blue-500 text-white px-6 mt-4" onClick={handleUpdateInviteSectionData}>Save</Button>
            <Button className="bg-gray-300 text-gray-800 px-6 mt-4" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
      </div>

      {/* Logos Section */}
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold py-2">Logos</h2>
        <div className="flex flex-wrap gap-3">
          {homepageData.logos.map((logo, index) => (
            <img key={index} src={logo} alt="logo" className="w-10 h-10" />
          ))}
        </div>
        <Button className="bg-blue-500 text-white mt-5"  onClick={() => setLogoEditing(true)}>
          Add Logo
        </Button>
        {/* Edit Logo Modal */}
        <Dialog open={logoEditing} onOpenChange={setLogoEditing}>
          <DialogContent className="dark:bg-gray-900 dark:text-gray-200">
            <div className="p-4">
              <Label className="mb-3">Upload Image</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
            </div>
            <div className="flex justify-end items-center gap-2">
              <Button onClick={handleAddLogo} className="bg-blue-500 text-white mt-5">Change Logo</Button>
              
            </div>
          </DialogContent>

        </Dialog>
      </div>

      {/* Other sections */}
      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b">Services</h2>
        <pre className="text-sm p-2 rounded">
          {/* {console.log('home page data services', homepageData.services)} */}
          { serviceEditing ? servicesData.map((service, index) => (
            <div key={index} className="border-b py-2 flex flex-col gap-2">
              <Input value={service.title} onChange={(e) => handleServiceChange(index, "title", e.target.value)} />
              <Input value={service.icon} onChange={(e) => handleServiceChange(index, "icon", e.target.value)} />
              <Input value={service.id} onChange={(e) => handleServiceChange(index, "id", e.target.value)} />
              <Textarea value={service.description} onChange={(e) => handleServiceChange(index, "description", e.target.value)} />
            </div>
          )) : servicesData.map((service, index) => (
            <div key={index} className="border-b py-2">
              <p>Service Id: {service.id}</p>
              <p>Service Icon: {service.icon}</p>
              <h3 className="font-semibold">Title: {service.title}</h3>
              <p>Description: {service.description}</p>
            </div>
          ))}
        </pre>
        <div className="flex gap-3">
        {!serviceEditing ? (
          <Button className="bg-blue-500 text-white px-6 mt-4" onClick={() => setServiceEditing(true)}>Edit</Button>
        ) : (
          <>
            <Button className="bg-blue-500 text-white px-6 mt-4" onClick={handleUpdateServiceSectionData}>Save</Button>
            <Button className="bg-gray-300 text-gray-800 px-6 mt-4" onClick={() => setServiceEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
      </div>

      <div className="p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b">Pricing Plans</h2>
        <pre className="text-sm p-2 rounded">
          {/* {JSON.stringify(homepageData.pricingPlans, null, 2)} */}
          { pricePlanEditing ?   pricingPlansData.map((plan, index) => (
            <div key={index} className="border-b py-2 flex flex-col gap-2">
              <Input value={plan.id} onChange={(e) => handlePricingPlanChange(index, "id", e.target.value)} />
              <Input value={plan.title} onChange={(e) => handlePricingPlanChange(index, "title", e.target.value)} />
              <Input value={plan.price} onChange={(e) => handlePricingPlanChange(index, "price", e.target.value)} />
              <Textarea value={plan.features.join(", ")} onChange={(e) => handlePricingPlanChange(index, "features", e.target.value.split(", "))} />
              <Checkbox checked={plan.highlighted} onChange={(e) => handlePricingPlanChange(index, "highlighted", e.target.checked)} />
            </div>
          )) : pricingPlansData.map((plan, index) => (
            <div key={index} className="border-b py-2">
              <p>Plan Id: {plan.id}</p>
              <h3 className="font-semibold">Title: {plan.title}</h3>
              <p>Features: {plan.features.map((feature, index) => (
                <span key={index} className="block">{feature}</span>
              ))}</p>
              <p>Price: {plan.price}</p>
              <p>Highlighted: {plan.highlighted ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </pre>
        <div className="flex gap-3">
        {!pricePlanEditing ? (
          <Button className="bg-blue-500 text-white px-6 mt-4" onClick={() => setPricePlanEditing(true)}>Edit</Button>
        ) : (
          <>
            <Button className="bg-blue-500 text-white px-6 mt-4" onClick={handleUpdatePricingPlan}>Save</Button>
            <Button className="bg-gray-300 text-gray-800 px-6 mt-4" onClick={() => setPricePlanEditing(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
      </div>

      
    </div>
  );
};

export default HomepageDataPage;
