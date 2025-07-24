import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Search, Book, CheckSquare, FileText, Calendar, BookOpen, Edit3, Share2, Mail, GraduationCap, Briefcase, User, Utensils, DollarSign, Heart, Activity } from 'lucide-react'
import { allProductTypes } from '../../data/productTypes'
import { ProductType } from '../../types'

const iconMap = {
  Book, CheckSquare, FileText, Calendar, BookOpen, Edit3, Share2, Mail, GraduationCap, Briefcase, User, Utensils, DollarSign, Heart, Activity
}

interface ProductTypeSelectorProps {
  onSelect: (productType: ProductType) => void
}

export function ProductTypeSelector({ onSelect }: ProductTypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(allProductTypes.map(type => type.category)))]
  
  const filteredTypes = allProductTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || type.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <FileText className="w-6 h-6" />
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Digital Product</h2>
        <p className="text-lg text-gray-600">Select from 60+ professional templates powered by AI</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search product types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTypes.map(type => (
          <Card 
            key={type.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-indigo-200"
            onClick={() => onSelect(type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    {getIcon(type.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {type.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-gray-600">
                {type.description}
              </CardDescription>
              <div className="mt-3 text-xs text-gray-500">
                {type.fields.length} customizable fields
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTypes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}